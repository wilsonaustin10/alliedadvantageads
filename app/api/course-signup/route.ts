import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.error('GoHighLevel API credentials not configured');
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Create contact using GoHighLevel API v2
    const contactData = {
      email: email,
      locationId: locationId,
      tags: ['free-course', 'lead-generation-course'],
      source: 'Course Landing Page',
      customFields: [
        {
          key: 'campaign',
          field_value: 'Free Lead Generation Course'
        },
        {
          key: 'signup_date',
          field_value: new Date().toISOString()
        }
      ]
    };

    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('GoHighLevel API error:', response.status, responseData);
      
      // Check for duplicate contact error
      if (response.status === 400 && responseData.message?.includes('duplicate')) {
        // Update existing contact instead
        const searchResponse = await fetch(`https://services.leadconnectorhq.com/contacts/lookup?email=${encodeURIComponent(email)}&locationId=${locationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28'
          }
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.contacts && searchData.contacts.length > 0) {
            const contactId = searchData.contacts[0].id;
            
            // Update the existing contact with new tags
            const updateResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
              },
              body: JSON.stringify({
                tags: ['free-course', 'lead-generation-course'],
                customFields: contactData.customFields
              }),
            });

            if (updateResponse.ok) {
              return NextResponse.json(
                { 
                  success: true,
                  message: 'Successfully signed up for the course!',
                  contactUpdated: true
                },
                { status: 200 }
              );
            }
          }
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to process signup. Please try again.' },
        { status: 500 }
      );
    }

    // Optionally trigger a workflow or campaign
    if (responseData.contact?.id) {
      console.log('Contact created successfully:', responseData.contact.id);
      
      // Trigger workflow if configured
      const workflowId = process.env.GOHIGHLEVEL_WORKFLOW_ID;
      if (workflowId) {
        try {
          const workflowResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${responseData.contact.id}/workflow/${workflowId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            }
          });
          
          if (workflowResponse.ok) {
            console.log('Workflow triggered successfully for contact:', responseData.contact.id);
          } else {
            console.error('Failed to trigger workflow:', await workflowResponse.text());
          }
        } catch (workflowError) {
          console.error('Error triggering workflow:', workflowError);
          // Don't fail the main request if workflow trigger fails
        }
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully signed up for the course!',
        contactId: responseData.contact?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing course signup:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}