import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, inviteCode } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !password || !inviteCode) {
      return NextResponse.json(
        { success: false, error: 'All fields are required including invite code' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const trimmedInviteCode = inviteCode.trim().toUpperCase();

    // Validate invite code
    const inviteCodeRef = db.collection('inviteCodes').doc(trimmedInviteCode);
    const inviteCodeDoc = await inviteCodeRef.get();

    if (!inviteCodeDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    const inviteCodeData = inviteCodeDoc.data();

    if (!inviteCodeData?.active) {
      return NextResponse.json(
        { success: false, error: 'This invite code is no longer active' },
        { status: 400 }
      );
    }

    const usageCount = inviteCodeData.usageCount || 0;
    const maxUses = inviteCodeData.maxUses || 1;

    if (usageCount >= maxUses) {
      return NextResponse.json(
        { success: false, error: 'This invite code has reached its maximum usage limit' },
        { status: 400 }
      );
    }

    if (inviteCodeData.expiresAt) {
      const expiresAt = inviteCodeData.expiresAt.toDate ?
        inviteCodeData.expiresAt.toDate() :
        new Date(inviteCodeData.expiresAt);

      if (new Date() > expiresAt) {
        return NextResponse.json(
          { success: false, error: 'This invite code has expired' },
          { status: 400 }
        );
      }
    }

    // Check if email already exists in Firebase Auth
    try {
      await auth.getUserByEmail(email);
      // If we get here, the user already exists
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    } catch (error: any) {
      // User doesn't exist, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Check if phone number already exists in our users collection
    const existingPhoneQuery = await db.collection('users')
      .where('phone', '==', phone)
      .limit(1)
      .get();

    if (!existingPhoneQuery.empty) {
      return NextResponse.json(
        { success: false, error: 'An account with this phone number already exists' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone.startsWith('+') ? phone : undefined, // Firebase requires E.164 format
    });

    // Determine access level from invite code
    const accessLevel = inviteCodeData.accessLevel || 'standard';

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      phone,
      accessLevel,
      inviteCodeUsed: trimmedInviteCode,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      onboardingCompleted: false,
    });

    // Increment invite code usage count
    await inviteCodeRef.update({
      usageCount: FieldValue.increment(1),
      usedBy: FieldValue.arrayUnion({
        uid: userRecord.uid,
        email,
        usedAt: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      uid: userRecord.uid,
      accessLevel,
    });

  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/invalid-phone-number') {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/phone-number-already-exists') {
      return NextResponse.json(
        { success: false, error: 'An account with this phone number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
