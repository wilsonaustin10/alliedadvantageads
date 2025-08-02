import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This contains the user ID
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/midprint?error=auth_failed', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/midprint?error=missing_params', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/midprint/auth/callback`
    );

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // For now, log the tokens until Firebase Admin is configured
    // In production, these would be stored securely in Firestore
    console.log('Google Ads OAuth tokens received for user:', state);
    console.log('Refresh token available:', !!tokens.refresh_token);

    // Redirect to MidPrint dashboard with account selection prompt
    return NextResponse.redirect(new URL('/midprint?oauth=success&selectAccount=true', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(new URL('/midprint?error=callback_failed', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  }
}