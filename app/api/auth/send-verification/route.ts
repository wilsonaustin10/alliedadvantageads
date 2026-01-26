import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@alliedleadgen.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Generate a secure verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { email, uid, name } = await request.json();

    if (!email || !uid) {
      return NextResponse.json(
        { success: false, error: 'Email and user ID are required' },
        { status: 400 }
      );
    }

    // Verify the user exists
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Check if already verified
    if (userData?.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

    // Store token in Firestore
    await db.collection('emailVerificationTokens').doc(verificationToken).set({
      uid,
      email,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: tokenExpiry,
      used: false,
    });

    // Send verification email
    if (SENDGRID_API_KEY) {
      const verificationLink = `${APP_URL}/verify-email?token=${verificationToken}`;

      const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: 'Verify Your Email - Allied Advantage',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Allied Advantage</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
              <p>Hello${name ? ` ${name}` : ''},</p>
              <p>Thank you for registering! Please verify your email address to complete your account setup and gain access to the platform.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}"
                   style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
              <p style="color: #2563eb; font-size: 12px; word-break: break-all;">${verificationLink}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 12px;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </body>
          </html>
        `,
      };

      try {
        await sgMail.send(msg);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return NextResponse.json(
          { success: false, error: 'Failed to send verification email. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      console.warn('SendGrid API key not configured. Verification email not sent.');
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
    });

  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
