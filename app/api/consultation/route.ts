import { NextResponse } from 'next/server';

// Go High Level uses personal access tokens (a.k.a. API Keys) for the public v1
// REST API. We keep the endpoint, location and token configurable through
// environment variables so we can point staging/production at different
// workspaces without code changes.
const GHL_ENDPOINT = process.env.GHL_ENDPOINT;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;

const CONSULTATION_TAGS = ['Website Lead', 'Consultation Request'];
const DEALS_PER_MONTH_FIELD_ID = 'deals_per_month';
const A2P_CONSENT_FIELD_ID = 'a2p_consent';

export async function POST(request: Request) {
  try {
    if (!GHL_ENDPOINT || !GHL_LOCATION_ID || !GHL_API_KEY) {
      console.error('Missing required environment variables:', {
        GHL_ENDPOINT: !!GHL_ENDPOINT,
        GHL_LOCATION_ID: !!GHL_LOCATION_ID,
        GHL_API_KEY: !!GHL_API_KEY,
      });

      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, dealsPerMonth, a2pConsent } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dealsPerMonth ||
      a2pConsent !== true
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Helper function to get base URL
    const getGHLBaseUrl = () => {
      if (!GHL_ENDPOINT) {
        throw new Error('GHL_ENDPOINT is not configured');
      }
      
      if (GHL_ENDPOINT.includes('rest.gohighlevel.com')) {
        return 'https://rest.gohighlevel.com/v1';
      } else if (GHL_ENDPOINT.includes('services.leadconnectorhq.com')) {
        return 'https://services.leadconnectorhq.com';
      }
      
      // Try to parse the endpoint URL
      try {
        const url = new URL(GHL_ENDPOINT);
        return `${url.protocol}//${url.host}${url.pathname.split('/contacts')[0]}`;
      } catch (urlError) {
        // If URL parsing fails, try to extract base URL manually
        const match = GHL_ENDPOINT.match(/^(https?:\/\/[^\/]+)/);
        if (match) {
          return match[1];
        }
        throw new Error(`Invalid GHL_ENDPOINT format: ${GHL_ENDPOINT}`);
      }
    };

    // First, try to lookup existing contact by email
    let baseUrl: string;
    let contactId: string | null = null;

    try {
      baseUrl = getGHLBaseUrl();
    } catch (urlError) {
      console.error('Failed to get GHL base URL:', urlError);
      throw new Error(`Invalid GHL endpoint configuration: ${urlError instanceof Error ? urlError.message : 'Unknown error'}`);
    }

    try {
      const lookupUrl = `${baseUrl}/contacts/lookup`;
      const lookupResponse = await fetch(
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

      if (lookupResponse.ok) {
        const lookupData = await lookupResponse.json();
        // Handle different response formats
        if (lookupData.contact?.id) {
          contactId = lookupData.contact.id;
        } else if (lookupData.contacts && lookupData.contacts.length > 0) {
          contactId = lookupData.contacts[0].id;
        }
        console.log('Found existing contact in GHL:', contactId);
      } else {
        // Lookup failed but that's okay, we'll create a new contact
        console.log('Contact lookup returned non-OK status, will create new contact');
      }
    } catch (lookupError) {
      // If lookup fails, we'll still try to create a new contact
      console.warn('Error looking up contact, will attempt to create new:', lookupError);
    }

    const ghlPayload = {
      firstName,
      lastName,
      email,
      phone,
      locationId: GHL_LOCATION_ID,
      source: 'Consultation Form',
      type: 'lead',
      tags: CONSULTATION_TAGS,
      customField: [
        {
          id: DEALS_PER_MONTH_FIELD_ID,
          value: dealsPerMonth,
        },
        {
          id: A2P_CONSENT_FIELD_ID,
          value: a2pConsent ? 'true' : 'false',
        },
      ],
    };

    console.log('Submitting consultation to GHL:', {
      firstName,
      lastName,
      email,
      phone,
      dealsPerMonth,
      a2pConsent,
      existingContact: !!contactId,
    });

    let ghlResponse: Response;
    let ghlData: any;

    if (contactId) {
      // Update existing contact
      const updateUrl = `${baseUrl}/contacts/${contactId}`;
      ghlResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify(ghlPayload),
      });
    } else {
      // Create new contact
      ghlResponse = await fetch(GHL_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify(ghlPayload),
      });
    }

    if (!ghlResponse.ok) {
      let errorPayload: unknown = null;

      try {
        errorPayload = await ghlResponse.json();
      } catch (parseError) {
        console.error('Failed to parse GHL error response', parseError);
      }

      console.error('GHL API responded with an error', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        body: errorPayload,
        method: contactId ? 'PUT' : 'POST',
      });

      const errorMessage =
        (errorPayload && typeof errorPayload === 'object' && 'message' in errorPayload
          ? (errorPayload as { message?: string }).message
          : null) || 'Failed to submit consultation';

      return NextResponse.json(
        { error: errorMessage },
        { status: ghlResponse.status }
      );
    }

    ghlData = await ghlResponse.json();
    console.log('Consultation submitted to GHL:', {
      contactId: ghlData.contact?.id || contactId,
      method: contactId ? 'updated' : 'created',
      data: ghlData,
    });

    return NextResponse.json(
      { message: 'Consultation request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing consultation request:', error);
    
    // Provide more detailed error information in development
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? { message: errorMessage, stack: error instanceof Error ? error.stack : undefined }
      : { message: 'Internal server error' };
    
    return NextResponse.json(
      errorDetails,
      { status: 500 }
    );
  }
}