import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// Go High Level API Configuration
const GHL_ENDPOINT = process.env.GHL_ENDPOINT;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;

// Calendly webhook signature verification (optional but recommended)
const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

// Maximum age of webhook requests (5 minutes) to prevent replay attacks
const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000;

interface CalendlyEvent {
  event: string; // 'invitee.created' or 'invitee.canceled'
  payload: {
    event_type: {
      kind: string;
      slug: string;
      name: string;
      duration: number;
    };
    event: {
      uuid: string;
      assigned_to: Array<{
        name: string;
        email: string;
      }>;
      extended_assigned_to: Array<{
        name: string;
        email: string;
      }>;
      start_time: string;
      start_time_pretty: string;
      end_time: string;
      end_time_pretty: string;
      location: string;
      canceled: boolean;
      canceler_name?: string;
      cancel_reason?: string;
      canceler_email?: string;
    };
    invitee: {
      uuid: string;
      first_name: string;
      last_name: string;
      name: string;
      email: string;
      text_reminder_number?: string;
      timezone: string;
      event_guest_urls: Array<{
        url: string;
      }>;
      created_at: string;
      updated_at: string;
    };
    questions_and_answers: Array<{
      question: string;
      answer: string;
    }>;
    tracking: {
      utm_campaign?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_content?: string;
      utm_term?: string;
      salesforce_uuid?: string;
    };
  };
}

/**
 * Get the base URL for GHL API
 */
function getGHLBaseUrl(): string {
  if (!GHL_ENDPOINT) return '';
  
  // Handle different endpoint formats
  if (GHL_ENDPOINT.includes('rest.gohighlevel.com')) {
    return 'https://rest.gohighlevel.com/v1';
  } else if (GHL_ENDPOINT.includes('services.leadconnectorhq.com')) {
    return 'https://services.leadconnectorhq.com';
  }
  
  // Extract base URL from endpoint
  const url = new URL(GHL_ENDPOINT);
  return `${url.protocol}//${url.host}${url.pathname.split('/contacts')[0]}`;
}

/**
 * Lookup contact in GHL by email
 */
async function lookupContactByEmail(email: string): Promise<string | null> {
  if (!GHL_ENDPOINT || !GHL_LOCATION_ID || !GHL_API_KEY) {
    return null;
  }

  try {
    const baseUrl = getGHLBaseUrl();
    const lookupUrl = `${baseUrl}/contacts/lookup`;
    
    const response = await fetch(
      `${lookupUrl}?email=${encodeURIComponent(email)}&locationId=${GHL_LOCATION_ID}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Handle different response formats
      if (data.contact?.id) {
        return data.contact.id;
      } else if (data.contacts && data.contacts.length > 0) {
        return data.contacts[0].id;
      }
    }

    return null;
  } catch (error) {
    console.error('Error looking up contact in GHL:', error);
    return null;
  }
}

/**
 * Update contact in GHL with appointment information
 */
async function updateContactWithAppointment(
  contactId: string,
  appointmentData: {
    eventType: string;
    startTime: string;
    endTime: string;
    location: string;
    canceled: boolean;
    cancelReason?: string;
  }
): Promise<boolean> {
  if (!GHL_ENDPOINT || !GHL_API_KEY) {
    return false;
  }

  try {
    const baseUrl = getGHLBaseUrl();
    const updateUrl = `${baseUrl}/contacts/${contactId}`;
    
    // Note: Custom field IDs need to be configured in GHL
    // These are placeholder IDs - replace with actual custom field IDs from your GHL account
    const updatePayload: any = {
      customField: [
        {
          id: 'appointment_scheduled',
          value: appointmentData.canceled ? 'false' : 'true',
        },
        {
          id: 'appointment_date',
          value: appointmentData.startTime,
        },
        {
          id: 'appointment_type',
          value: appointmentData.eventType,
        },
        {
          id: 'appointment_location',
          value: appointmentData.location,
        },
      ],
    };

    if (appointmentData.canceled && appointmentData.cancelReason) {
      updatePayload.customField.push({
        id: 'appointment_cancel_reason',
        value: appointmentData.cancelReason,
      });
    }

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to update contact in GHL:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating contact in GHL:', error);
    return false;
  }
}

/**
 * Add appointment note to contact in GHL
 */
async function addAppointmentNote(
  contactId: string,
  note: string
): Promise<boolean> {
  if (!GHL_ENDPOINT || !GHL_API_KEY) {
    return false;
  }

  try {
    const baseUrl = getGHLBaseUrl();
    const notesUrl = `${baseUrl}/contacts/${contactId}/notes`;
    
    const response = await fetch(notesUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        body: note,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding note to contact in GHL:', error);
    return false;
  }
}

/**
 * Verify Calendly webhook signature
 * @param rawBody - The raw request body as string
 * @param signature - The signature from Calendly-Webhook-Signature header
 * @param timestamp - The timestamp from Calendly-Webhook-Timestamp header
 * @param signingKey - The signing key from environment variables
 * @returns true if signature is valid, false otherwise
 */
function verifyCalendlySignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  signingKey: string
): boolean {
  try {
    // Check timestamp to prevent replay attacks
    const requestTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    const age = currentTime - requestTime;

    if (age > MAX_WEBHOOK_AGE_MS || age < 0) {
      console.warn('Webhook timestamp is too old or invalid:', {
        requestTime,
        currentTime,
        age,
        maxAge: MAX_WEBHOOK_AGE_MS,
      });
      return false;
    }

    // Construct the payload: timestamp + '.' + rawBody
    const payload = `${timestamp}.${rawBody}`;

    // Compute HMAC-SHA256 signature
    const hmac = createHmac('sha256', signingKey);
    hmac.update(payload);
    const expectedSignature = hmac.digest('base64');

    // Check if signatures have the same length before comparing
    // timingSafeEqual requires both buffers to be the same length
    if (signature.length !== expectedSignature.length) {
      console.warn('Calendly webhook signature length mismatch', {
        signatureLength: signature.length,
        expectedLength: expectedSignature.length,
      });
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    const isValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.warn('Calendly webhook signature verification failed');
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying Calendly webhook signature:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    // We need to clone the request to read the body multiple times
    const clonedRequest = request.clone();
    const rawBody = await clonedRequest.text();

    // Verify webhook signature if signing key is configured
    if (CALENDLY_WEBHOOK_SIGNING_KEY) {
      const signature = request.headers.get('calendly-webhook-signature');
      const timestamp = request.headers.get('calendly-webhook-timestamp');

      if (!signature || !timestamp) {
        console.warn('Missing Calendly webhook signature or timestamp', {
          hasSignature: !!signature,
          hasTimestamp: !!timestamp,
        });
        return NextResponse.json(
          { error: 'Missing webhook signature or timestamp' },
          { status: 401 }
        );
      }

      // Verify the signature
      const isValid = verifyCalendlySignature(
        rawBody,
        signature,
        timestamp,
        CALENDLY_WEBHOOK_SIGNING_KEY
      );

      if (!isValid) {
        console.error('Invalid Calendly webhook signature');
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }

      console.log('Calendly webhook signature verified successfully');
    } else {
      console.warn(
        'CALENDLY_WEBHOOK_SIGNING_KEY not configured. Webhook signature verification is disabled.'
      );
    }

    if (!GHL_ENDPOINT || !GHL_LOCATION_ID || !GHL_API_KEY) {
      console.error('Missing required GHL environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse the body as JSON now that we've verified the signature
    const body = JSON.parse(rawBody);
    const event: CalendlyEvent = body;

    // Only process invitee.created and invitee.canceled events
    if (
      event.event !== 'invitee.created' &&
      event.event !== 'invitee.canceled'
    ) {
      console.log(`Ignoring event type: ${event.event}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const { invitee, event: calendlyEvent } = event.payload;
    const email = invitee.email;

    if (!email) {
      console.error('Missing email in Calendly webhook payload');
      return NextResponse.json(
        { error: 'Missing email' },
        { status: 400 }
      );
    }

    console.log('Processing Calendly webhook:', {
      event: event.event,
      email,
      eventType: event.payload.event_type.name,
      startTime: calendlyEvent.start_time,
      canceled: calendlyEvent.canceled,
    });

    // Lookup contact in GHL by email
    const contactId = await lookupContactByEmail(email);

    if (!contactId) {
      console.warn(
        `Contact not found in GHL for email: ${email}. Appointment data will not be synced.`
      );
      // Return success to Calendly even if contact not found
      // This prevents Calendly from retrying
      return NextResponse.json(
        {
          received: true,
          warning: 'Contact not found in GHL',
        },
        { status: 200 }
      );
    }

    // Prepare appointment data
    const appointmentData = {
      eventType: event.payload.event_type.name,
      startTime: calendlyEvent.start_time,
      endTime: calendlyEvent.end_time,
      location: calendlyEvent.location || 'Virtual',
      canceled: calendlyEvent.canceled || false,
      cancelReason: calendlyEvent.cancel_reason,
    };

    // Update contact with appointment information
    const updateSuccess = await updateContactWithAppointment(
      contactId,
      appointmentData
    );

    if (!updateSuccess) {
      console.error('Failed to update contact with appointment data');
    }

    // Add a note to the contact
    const noteText = calendlyEvent.canceled
      ? `Appointment Canceled: ${event.payload.event_type.name} scheduled for ${calendlyEvent.start_time_pretty} was canceled.${calendlyEvent.cancel_reason ? ` Reason: ${calendlyEvent.cancel_reason}` : ''}`
      : `Appointment Scheduled: ${event.payload.event_type.name} on ${calendlyEvent.start_time_pretty} at ${calendlyEvent.location || 'Virtual'}`;

    await addAppointmentNote(contactId, noteText);

    console.log('Successfully processed Calendly webhook for contact:', contactId);

    return NextResponse.json(
      {
        received: true,
        contactId,
        updated: updateSuccess,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calendly webhooks can also send GET requests for verification
export async function GET(request: Request) {
  return NextResponse.json(
    { message: 'Calendly webhook endpoint is active' },
    { status: 200 }
  );
}

