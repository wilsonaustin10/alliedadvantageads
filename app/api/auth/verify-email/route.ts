import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Look up the token
    const tokenDoc = await db.collection('emailVerificationTokens').doc(token).get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    const tokenData = tokenDoc.data();

    // Check if token has been used
    if (tokenData?.used) {
      return NextResponse.json(
        { success: false, error: 'This verification link has already been used' },
        { status: 400 }
      );
    }

    // Check if token has expired
    const expiresAt = tokenData?.expiresAt?.toDate ? tokenData.expiresAt.toDate() : new Date(tokenData?.expiresAt);
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { success: false, error: 'This verification link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const uid = tokenData?.uid;
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'Invalid token data' },
        { status: 400 }
      );
    }

    // Update user document to mark email as verified
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user to verified
    await userRef.update({
      emailVerified: true,
      emailVerifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Mark token as used
    await db.collection('emailVerificationTokens').doc(token).update({
      used: true,
      usedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error: any) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

// GET endpoint for direct link verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Verification token is required' },
      { status: 400 }
    );
  }

  // Reuse POST logic
  const fakeRequest = {
    json: async () => ({ token }),
  } as Request;

  return POST(fakeRequest);
}
