import { NextResponse } from 'next/server';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY || ''); // SendGrid removed

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, package: selectedPackage } = body;

    // Log the contact form submission (replace with desired action, e.g., save to DB)
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      message,
      selectedPackage,
    });

    // Email content - REMOVED
    // const emailContent = `...`;

    // Email configuration - REMOVED
    // const msg = { ... };

    // Send email - REMOVED
    // await sgMail.send(msg);

    return NextResponse.json(
      { message: 'Form submitted successfully. We will be in touch soon!' }, // Updated message
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