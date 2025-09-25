import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, tool } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Here you would typically save to a database
    // For now, we'll just log it and return success
    console.log('Waitlist signup:', { email, tool, timestamp: new Date().toISOString() });

    // In production, you might want to:
    // 1. Save to database (Supabase, Firebase, etc.)
    // 2. Send confirmation email
    // 3. Add to email marketing list (Mailchimp, SendGrid, etc.)

    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}