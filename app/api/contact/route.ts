import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, package: selectedPackage } = body;

    // Email content
    const emailContent = `
      New Lead from Allied Lead Gen Website
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Selected Package: ${selectedPackage}
      Message: ${message}
    `;

    // Email configuration
    const msg = {
      to: ['austin@alliedhousebuyers.com', 'tom@alliedhousebuyers.com'],
      from: 'noreply@alliedleadgen.com', // This needs to be verified in SendGrid
      subject: 'New Lead from Allied Lead Gen Website',
      text: emailContent,
      html: `
        <h2>New Lead from Allied Lead Gen Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Selected Package:</strong> ${selectedPackage}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error submitting form' },
      { status: 500 }
    );
  }
} 