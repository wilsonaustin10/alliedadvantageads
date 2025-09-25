import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'leads@company.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

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

    await saveLeadToDatabase(formData);

    if (SENDGRID_API_KEY) {
      await sendNotificationEmail(formData);
      await sendConfirmationEmail(email, name);
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

async function saveLeadToDatabase(data: any): Promise<void> {
  console.log('Saving lead:', {
    ...data,
    timestamp: new Date().toISOString(),
    source: 'landing-page-builder'
  });
}

async function sendNotificationEmail(data: any): Promise<void> {
  const msg = {
    to: NOTIFICATION_EMAIL,
    from: 'noreply@alliedadvantage.com',
    subject: `New Lead: ${data.name}`,
    html: `
      <h2>New Lead Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
      <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
}

async function sendConfirmationEmail(email: string, name: string): Promise<void> {
  const msg = {
    to: email,
    from: 'noreply@alliedadvantage.com',
    subject: 'Thank you for contacting us',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us. We have received your inquiry and will get back to you within 24 hours.</p>
      <p>If you have any urgent questions, please don't hesitate to call us directly.</p>
      <br>
      <p>Best regards,<br>The Team</p>
    `
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}