import { NextRequest, NextResponse } from 'next/server';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const { name, email, phone, company, message } = formData;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Log lead submission
    console.log('New lead submission:', {
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'landing-page-builder'
    });

    // Send to Zapier webhook if configured (for email notifications, CRM, etc.)
    if (ZAPIER_WEBHOOK_URL) {
      try {
        await fetch(ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            company: company || '',
            message: message || '',
            timestamp: new Date().toISOString(),
            source: 'landing-page-builder'
          }),
        });
      } catch (webhookError) {
        console.error('Failed to send to webhook:', webhookError);
        // Don't fail the submission if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your submission. We will contact you soon!'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
