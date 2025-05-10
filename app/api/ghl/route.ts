import { NextResponse } from 'next/server';
import type { GHLContact } from './types';

// Go High Level API Configuration
const GHL_BASE_URL = 'https://rest.gohighlevel.com/v1';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Transform the onboarding form data to GHL contact format
    const contact: GHLContact = {
      firstName: body.firstName,
      lastName: body.lastName,
      businessName: body.businessName,
      email: body.publicEmail,
      phone: body.publicPhone,
      website: body.websiteUrl,
      locationId: GHL_LOCATION_ID,
      source: 'Onboarding Form',
      type: 'lead',
      tags: ['New Client', 'Onboarding'],
      customField: [
        {
          id: 'website_hosting',  // Replace with your actual custom field ID
          value: body.websiteHosting
        },
        {
          id: 'has_crm',  // Replace with your actual custom field ID
          value: body.hasCrm
        },
        {
          id: 'crm_name',  // Replace with your actual custom field ID
          value: body.crmName
        },
        {
          id: 'has_logo',  // Replace with your actual custom field ID
          value: body.hasLogo
        },
        {
          id: 'primary_color',  // Replace with your actual custom field ID
          value: body.primaryColor
        },
        {
          id: 'secondary_color',  // Replace with your actual custom field ID
          value: body.secondaryColor
        },
        {
          id: 'has_google_ads',  // Replace with your actual custom field ID
          value: body.hasGoogleAds
        },
        {
          id: 'google_ads_id',  // Replace with your actual custom field ID
          value: body.googleAdsId
        },
        {
          id: 'target_geography_type',  // Replace with your actual custom field ID
          value: body.targetGeographyType
        },
        {
          id: 'include_geography',  // Replace with your actual custom field ID
          value: body.includeGeography
        },
        {
          id: 'exclude_geography',  // Replace with your actual custom field ID
          value: body.excludeGeography
        }
      ]
    };

    // Make the API call to Go High Level
    const response = await fetch(`${GHL_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create contact in GHL');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error creating contact in GHL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
} 