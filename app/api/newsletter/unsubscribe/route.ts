import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter unsubscribe API endpoint
 * POST /api/newsletter/unsubscribe
 * 
 * Removes subscriber from MailerLite
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

    if (!MAILERLITE_API_KEY) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { success: false, error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // First, get the subscriber to check if they exist
    const getResponse = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
      }
    );

    if (getResponse.status === 404) {
      return NextResponse.json(
        { success: false, error: 'Email not found in our subscriber list' },
        { status: 404 }
      );
    }

    if (!getResponse.ok) {
      const errorData = await getResponse.json();
      console.error('MailerLite GET error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to find subscriber' },
        { status: getResponse.status }
      );
    }

    const subscriberData = await getResponse.json();
    const subscriberId = subscriberData.data?.id;

    if (!subscriberId) {
      return NextResponse.json(
        { success: false, error: 'Could not find subscriber ID' },
        { status: 500 }
      );
    }

    // Delete (unsubscribe) the subscriber
    const deleteResponse = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${subscriberId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
      }
    );

    if (deleteResponse.status === 204 || deleteResponse.ok) {
      console.log('📧 Subscriber unsubscribed:', email);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully unsubscribed from newsletter' 
        },
        { status: 200 }
      );
    }

    // Handle errors
    let errorMessage = 'Failed to unsubscribe';
    try {
      const errorData = await deleteResponse.json();
      errorMessage = errorData.message || errorMessage;
      console.error('MailerLite DELETE error:', errorData);
    } catch {
      // Response might be empty for some error codes
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: deleteResponse.status }
    );

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
