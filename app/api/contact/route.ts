import { NextResponse } from 'next/server';

// Go High Level API Configuration
const GHL_ENDPOINT = process.env.GHL_ENDPOINT;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;

export async function POST(request: Request) {
  try {
    // Validate required environment variables
    if (!GHL_ENDPOINT || !GHL_LOCATION_ID || !GHL_API_KEY) {
      console.error('Missing required environment variables:', {
        GHL_ENDPOINT: !!GHL_ENDPOINT,
        GHL_LOCATION_ID: !!GHL_LOCATION_ID,
        GHL_API_KEY: !!GHL_API_KEY,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, message, package: selectedPackage } = body;

    // Log the contact form submission
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      message,
      selectedPackage,
    });

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create contact in Go High Level
    const ghlContact = {
      firstName,
      lastName,
      email,
      phone,
      companyName: company,
      locationId: GHL_LOCATION_ID,
      source: 'Contact Form',
      type: 'lead',
      tags: ['Website Lead', 'Contact Form'],
      customField: [
        {
          id: 'package_interest', // Replace with your actual custom field ID in GHL
          value: selectedPackage
        },
        {
          id: 'initial_message', // Replace with your actual custom field ID in GHL
          value: message
        }
      ]
    };

    // Make the API call to Go High Level
    const ghlResponse = await fetch(GHL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(ghlContact)
    });

    if (!ghlResponse.ok) {
      const error = await ghlResponse.json();
      throw new Error(error.message || 'Failed to create contact in GHL');
    }

    const ghlData = await ghlResponse.json();
    console.log('Contact created in GHL:', ghlData);

    return NextResponse.json(
      { message: 'Form submitted successfully. We will be in touch soon!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error submitting form' },
      { status: 500 }
    );
  }
} 