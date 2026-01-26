import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to verify admin access
async function verifyAdminAccess(request: Request): Promise<{ authorized: boolean; error?: string; uid?: string }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return { authorized: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    if (userData?.accessLevel !== 'admin') {
      return { authorized: false, error: 'Admin access required' };
    }

    return { authorized: true, uid: decodedToken.uid };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return { authorized: false, error: 'Invalid or expired token' };
  }
}

// GET - List all users (admin only)
export async function GET(request: Request) {
  const accessCheck = await verifyAdminAccess(request);
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { success: false, error: accessCheck.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const accessLevelFilter = searchParams.get('accessLevel');
    const emailVerifiedFilter = searchParams.get('emailVerified');

    let query = db.collection('users').orderBy('createdAt', 'desc').limit(limit);

    // Apply filters if provided
    if (accessLevelFilter) {
      query = db.collection('users')
        .where('accessLevel', '==', accessLevelFilter)
        .orderBy('createdAt', 'desc')
        .limit(limit);
    }

    const usersSnapshot = await query.get();

    let users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        accessLevel: data.accessLevel || 'standard',
        emailVerified: data.emailVerified ?? null,
        emailVerifiedAt: data.emailVerifiedAt?.toDate?.()?.toISOString() || null,
        onboardingCompleted: data.onboardingCompleted || false,
        inviteCodeUsed: data.inviteCodeUsed || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        isActive: data.isActive !== false, // Default to true if not set
      };
    });

    // Apply email verified filter in memory (Firestore doesn't support multiple inequality filters)
    if (emailVerifiedFilter !== null) {
      const filterValue = emailVerifiedFilter === 'true';
      users = users.filter(u => u.emailVerified === filterValue);
    }

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list users' },
      { status: 500 }
    );
  }
}

// PATCH - Update a user (admin only)
export async function PATCH(request: Request) {
  const accessCheck = await verifyAdminAccess(request);
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { success: false, error: accessCheck.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { uid, accessLevel, isActive, emailVerified } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from modifying their own access level
    if (uid === accessCheck.uid && accessLevel !== undefined) {
      return NextResponse.json(
        { success: false, error: 'You cannot modify your own access level' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Validate and set access level
    if (accessLevel !== undefined) {
      const validAccessLevels = ['standard', 'premium', 'admin'];
      if (!validAccessLevels.includes(accessLevel)) {
        return NextResponse.json(
          { success: false, error: 'Invalid access level. Must be: standard, premium, or admin' },
          { status: 400 }
        );
      }
      updates.accessLevel = accessLevel;
    }

    // Set active status
    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    // Set email verified status (for manual verification)
    if (typeof emailVerified === 'boolean') {
      updates.emailVerified = emailVerified;
      if (emailVerified) {
        updates.emailVerifiedAt = FieldValue.serverTimestamp();
      }
    }

    await userRef.update(updates);

    // Get updated user data
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        uid,
        accessLevel: updatedData?.accessLevel,
        isActive: updatedData?.isActive,
        emailVerified: updatedData?.emailVerified,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate a user (admin only) - soft delete
export async function DELETE(request: Request) {
  const accessCheck = await verifyAdminAccess(request);
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { success: false, error: accessCheck.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (uid === accessCheck.uid) {
      return NextResponse.json(
        { success: false, error: 'You cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete - set isActive to false
    await userRef.update({
      isActive: false,
      deactivatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Optionally disable the Firebase Auth account
    try {
      await auth.updateUser(uid, { disabled: true });
    } catch (authError) {
      console.error('Failed to disable Firebase Auth user:', authError);
      // Don't fail the request if Firebase Auth update fails
    }

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
