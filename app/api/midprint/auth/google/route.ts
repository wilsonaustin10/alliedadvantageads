import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Debug logging
    console.log('OAuth Client Configuration:', {
      clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Using default'
    });

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'OAuth credentials not configured' },
        { status: 500 }
      );
    }

    // Initialize OAuth2 client with environment variables
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/midprint/auth/callback`;
    console.log('Redirect URI being used:', redirectUri);
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Generate the Google OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/adwords',
      ],
      // Include the user ID in the state parameter for the callback
      state: request.nextUrl.searchParams.get('userId') || '',
      prompt: 'consent' // Force consent to ensure we get a refresh token
    });

    console.log('Generated auth URL:', authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google authentication' },
      { status: 500 }
    );
  }
}