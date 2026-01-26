import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to generate a random invite code
function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to verify admin access
async function verifyAdminAccess(request: Request): Promise<{ authorized: boolean; error?: string }> {
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

    return { authorized: true };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return { authorized: false, error: 'Invalid or expired token' };
  }
}

// GET - List all invite codes (admin only)
export async function GET(request: Request) {
  const accessCheck = await verifyAdminAccess(request);
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { success: false, error: accessCheck.error },
      { status: 401 }
    );
  }

  try {
    const inviteCodesSnapshot = await db.collection('inviteCodes')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const inviteCodes = inviteCodesSnapshot.docs.map(doc => ({
      code: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ success: true, inviteCodes });
  } catch (error) {
    console.error('Error listing invite codes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list invite codes' },
      { status: 500 }
    );
  }
}

// POST - Create a new invite code (admin only)
export async function POST(request: Request) {
  const accessCheck = await verifyAdminAccess(request);
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { success: false, error: accessCheck.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      code: customCode,
      maxUses = 1,
      accessLevel = 'standard',
      expiresInDays,
      note,
    } = body;

    // Validate access level
    const validAccessLevels = ['standard', 'premium', 'admin'];
    if (!validAccessLevels.includes(accessLevel)) {
      return NextResponse.json(
        { success: false, error: 'Invalid access level. Must be: standard, premium, or admin' },
        { status: 400 }
      );
    }

    // Generate or use custom code
    let inviteCode = customCode?.trim().toUpperCase() || generateInviteCode();

    // Check if code already exists
    const existingCode = await db.collection('inviteCodes').doc(inviteCode).get();
    if (existingCode.exists) {
      // Generate a new code if custom code exists
      if (customCode) {
        return NextResponse.json(
          { success: false, error: 'Invite code already exists' },
          { status: 400 }
        );
      }
      // Auto-generate a new unique code
      for (let i = 0; i < 5; i++) {
        inviteCode = generateInviteCode();
        const checkCode = await db.collection('inviteCodes').doc(inviteCode).get();
        if (!checkCode.exists) break;
      }
    }

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays && typeof expiresInDays === 'number' && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create the invite code document
    await db.collection('inviteCodes').doc(inviteCode).set({
      active: true,
      maxUses: Math.max(1, maxUses),
      usageCount: 0,
      accessLevel,
      expiresAt,
      note: note || null,
      usedBy: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      inviteCode,
      accessLevel,
      maxUses,
      expiresAt: expiresAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Error creating invite code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invite code' },
      { status: 500 }
    );
  }
}

// PATCH - Update an invite code (deactivate, etc.) (admin only)
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
    const { code, active, maxUses, note } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    const inviteCodeRef = db.collection('inviteCodes').doc(code.trim().toUpperCase());
    const inviteCodeDoc = await inviteCodeRef.get();

    if (!inviteCodeDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invite code not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (typeof active === 'boolean') {
      updates.active = active;
    }
    if (typeof maxUses === 'number' && maxUses > 0) {
      updates.maxUses = maxUses;
    }
    if (note !== undefined) {
      updates.note = note;
    }

    await inviteCodeRef.update(updates);

    return NextResponse.json({
      success: true,
      message: 'Invite code updated successfully',
    });
  } catch (error) {
    console.error('Error updating invite code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invite code' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an invite code (admin only)
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
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    const inviteCodeRef = db.collection('inviteCodes').doc(code.trim().toUpperCase());
    const inviteCodeDoc = await inviteCodeRef.get();

    if (!inviteCodeDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invite code not found' },
        { status: 404 }
      );
    }

    await inviteCodeRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Invite code deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invite code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invite code' },
      { status: 500 }
    );
  }
}
