import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { inviteCode } = await request.json();

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    const trimmedCode = inviteCode.trim().toUpperCase();

    // Look up the invite code in Firestore
    const inviteCodeRef = db.collection('inviteCodes').doc(trimmedCode);
    const inviteCodeDoc = await inviteCodeRef.get();

    if (!inviteCodeDoc.exists) {
      return NextResponse.json(
        { valid: false, error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    const inviteCodeData = inviteCodeDoc.data();

    // Check if the invite code is active
    if (!inviteCodeData?.active) {
      return NextResponse.json(
        { valid: false, error: 'This invite code is no longer active' },
        { status: 400 }
      );
    }

    // Check if the invite code has reached its usage limit
    const usageCount = inviteCodeData.usageCount || 0;
    const maxUses = inviteCodeData.maxUses || 1;

    if (usageCount >= maxUses) {
      return NextResponse.json(
        { valid: false, error: 'This invite code has reached its maximum usage limit' },
        { status: 400 }
      );
    }

    // Check if the invite code has expired
    if (inviteCodeData.expiresAt) {
      const expiresAt = inviteCodeData.expiresAt.toDate ?
        inviteCodeData.expiresAt.toDate() :
        new Date(inviteCodeData.expiresAt);

      if (new Date() > expiresAt) {
        return NextResponse.json(
          { valid: false, error: 'This invite code has expired' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      accessLevel: inviteCodeData.accessLevel || 'standard'
    });

  } catch (error) {
    console.error('Error validating invite code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate invite code' },
      { status: 500 }
    );
  }
}
