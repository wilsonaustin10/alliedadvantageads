import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // For now, return mock data
    // In production, this would use the Google Ads API to list accessible accounts
    const accounts = [
      {
        customerId: '1234567890',
        descriptiveName: 'Allied Lead Gen - Main Account',
        currencyCode: 'USD',
        timeZone: 'America/New_York',
        canManageClients: false
      },
      {
        customerId: '0987654321',
        descriptiveName: 'Allied Lead Gen - Test Account',
        currencyCode: 'USD',
        timeZone: 'America/New_York',
        canManageClients: false
      }
    ];

    // In production, you would:
    // 1. Get the user's refresh token from Firestore
    // 2. Use Google Ads API to call CustomerService.listAccessibleCustomers()
    // 3. For each customer ID, get the customer details
    // 4. Return the list for user selection

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error listing Google Ads accounts:', error);
    return NextResponse.json(
      { error: 'Failed to list accounts' },
      { status: 500 }
    );
  }
}