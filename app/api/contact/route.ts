import { NextResponse } from 'next/server';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

if (!ZAPIER_WEBHOOK_URL) {
  throw new Error(
    'Missing ZAPIER_WEBHOOK_URL environment variable. Please set it to your Zapier webhook URL.'
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, package: selectedPackage } = body;

    // Log the contact form submission
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      message,
      selectedPackage,
    });

    const payload = {
      name,
      email,
      phone,
      company,
      message,
      package: selectedPackage,
    };

    const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
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
    console.log('Contact forwarded to Zapier:', responseText);

    return NextResponse.json(
      { message: 'Form submitted successfully. We will be in touch soon!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error submitting form' },
      { status: 500 }
    );
  }
}
