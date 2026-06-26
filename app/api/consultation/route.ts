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
    const { firstName, lastName, email, phone, dealsPerMonth, a2pConsent } = body;

    // Validate required fields (SMS consent is intentionally optional)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dealsPerMonth
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log the consultation form submission
    console.log('Consultation Form Submission:', {
      firstName,
      lastName,
      email,
      phone,
      dealsPerMonth,
      a2pConsent,
    });

    // Prepare payload for Zapier
    // Use 'playbook' tag for non-qualified leads, 'consultation' for qualified
    const tag = body.isQualified ? 'consultation' : 'playbook';
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      primaryMarket: body.primaryMarket,
      monthlyBudget: body.monthlyBudget,
      dealsPerMonth,
      biggestBottleneck: body.biggestBottleneck,
      isQualified: body.isQualified,
      a2pConsent,
      tag,
      source: 'Application Form',
      formType: 'consultation',
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
    console.log('Consultation forwarded to Zapier:', responseText);

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