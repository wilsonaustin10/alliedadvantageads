import { NextResponse } from 'next/server';

function getZapierWebhookUrl(): string {
  const url = process.env.ZAPIER_WEBHOOK_URL;

  if (!url) {
    throw new Error(
      'Missing ZAPIER_WEBHOOK_URL environment variable. Please set it to your Zapier webhook URL.'
    );
  }

  return url;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, a2pConsent } = body;

    // Name, email, and phone are required so we can follow up.
    // SMS consent (a2pConsent) is intentionally optional — booking must work
    // whether or not the visitor opts into text messages.
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone,
      a2pConsent: a2pConsent === true,
      tag: 'consultation',
      source: 'Booking Page',
      formType: 'booking',
    };

    const zapierResponse = await fetch(getZapierWebhookUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!zapierResponse.ok) {
      const errorText = await zapierResponse.text();
      throw new Error(
        `Zapier webhook request failed with status ${zapierResponse.status}: ${errorText}`
      );
    }

    const responseText = await zapierResponse.text();
    console.log('Booking forwarded to Zapier:', responseText);

    return NextResponse.json(
      { message: 'Consultation request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing booking request:', error);
    return NextResponse.json(
      { error: 'Error submitting form' },
      { status: 500 }
    );
  }
}
