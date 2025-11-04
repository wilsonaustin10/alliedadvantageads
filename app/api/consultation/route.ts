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
    });

    const ghlResponse = await fetch(GHL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify(ghlPayload),
    });

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

    const ghlData = await ghlResponse.json();
    console.log('Consultation submitted to GHL:', ghlData);

    return NextResponse.json(
      { message: 'Consultation request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing consultation request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}