import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { firstName, lastName, email, phone, dealsPerMonth } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dealsPerMonth) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Add to CRM
    // 4. Send confirmation email to user
    
    // For now, we'll just log it
    console.log('New consultation request:', {
      firstName,
      lastName,
      email,
      phone,
      dealsPerMonth,
      timestamp: new Date().toISOString()
    });
    
    // You can integrate with your email service here
    // Example: await sendEmail({ to: email, subject: 'Consultation Scheduled', ... })
    
    // You can also integrate with a CRM or database here
    // Example: await saveToDatabase({ firstName, lastName, email, phone, dealsPerMonth })
    
    return NextResponse.json(
      { message: 'Consultation request received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing consultation request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}