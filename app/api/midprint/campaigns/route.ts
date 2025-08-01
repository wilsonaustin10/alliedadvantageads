import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // For now, return mock data until Firebase Admin is properly configured
    // In production, this would verify the auth token and fetch from Firestore
    
    const campaigns = [
      { id: '1', name: 'Brand Awareness Campaign', status: 'ENABLED' },
      { id: '2', name: 'Lead Generation Campaign', status: 'ENABLED' },
      { id: '3', name: 'Seasonal Promotion', status: 'PAUSED' }
    ];

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}