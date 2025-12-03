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
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the playbook download request
    console.log('Playbook Download Request:', {
      name,
      email,
      timestamp: new Date().toISOString(),
      source: 'lead-magnet-section',
    });

    // Prepare payload for Zapier
    const payload = {
      firstName: name,
      email,
      tag: 'playbook',
      source: 'Playbook Download',
      formType: 'playbook',
      timestamp: new Date().toISOString(),
    };

    // Send to Zapier webhook
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
    console.log('Playbook download forwarded to Zapier:', responseText);

    return NextResponse.json({
      success: true,
      message: 'Playbook request received',
    });
  } catch (error) {
    console.error('Playbook download error:', error);

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
