import { NextResponse } from 'next/server';

type WaitlistRequest = {
  email: string;
  tool?: string;
};

const GHL_ENDPOINT = process.env.GHL_ENDPOINT;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;

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

    const { email, tool }: WaitlistRequest = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const localPart = email.split('@')[0] ?? '';
    const nameSegments = localPart
      .split(/[._-]+/)
      .map((segment: string) => segment.trim())
      .filter(Boolean);

    const formatName = (value: string, fallback: string) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1) : fallback;

    const firstName = formatName(nameSegments[0] ?? '', 'Waitlist');
    const lastName = formatName(nameSegments.slice(1).join(' ') ?? '', 'Lead');

    const tags = ['Waitlist Lead'];
    if (tool) {
      tags.push(`Tool: ${tool}`);
    }

    const ghlContact = {
      firstName,
      lastName,
      email,
      locationId: GHL_LOCATION_ID,
      source: 'Waitlist Form',
      type: 'lead',
      tags,
    };

    const ghlResponse = await fetch(GHL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify(ghlContact),
    });

    if (!ghlResponse.ok) {
      let errorMessage = 'Failed to create waitlist contact in GHL';
      let errorDetails: unknown = null;

      try {
        const errorBody = await ghlResponse.json();
        errorMessage = errorBody?.message || errorMessage;
        errorDetails = errorBody;
      } catch (jsonError) {
        const errorText = await ghlResponse.text();
        errorDetails = errorText;
      }

      console.error('GHL waitlist error:', {
        status: ghlResponse.status,
        error: errorDetails,
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: ghlResponse.status || 500 }
      );
    }

    const ghlData = await ghlResponse.json();
    console.log('Waitlist contact created in GHL:', ghlData);

    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    const message = error instanceof Error ? error.message : 'Failed to join waitlist';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
