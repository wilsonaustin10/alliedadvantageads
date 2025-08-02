import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const campaignId = searchParams.get('campaignId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // For now, return mock metrics until Firebase Admin is properly configured
    // In production, this would verify auth and query Firestore
    
    // Generate realistic mock data based on date range
    const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    
    let totalImpressions = Math.floor(Math.random() * 10000 * daysDiff) + 5000 * daysDiff;
    let totalClicks = Math.floor(totalImpressions * (Math.random() * 0.03 + 0.02)); // 2-5% CTR
    let totalCost = totalClicks * (Math.random() * 2 + 0.5); // $0.50-$2.50 CPC
    let totalConversions = Math.floor(totalClicks * (Math.random() * 0.05 + 0.02)); // 2-7% conversion rate

    const metrics = {
      impressions: totalImpressions,
      clicks: totalClicks,
      cost: totalCost,
      conversions: totalConversions,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      cpc: totalClicks > 0 ? totalCost / totalClicks : 0
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}