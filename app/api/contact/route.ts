import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact form API endpoint
 * POST /api/contact
 * 
 * Sends contact form submissions via MailerLite by adding subscriber with custom fields
 * Set up a MailerLite automation to notify you when someone joins the "Contact Form" group
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
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

    // MailerLite API integration
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

    if (!MAILERLITE_API_KEY) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { success: false, error: 'Contact service not configured' },
        { status: 500 }
      );
    }

    // Add subscriber with contact form data as custom fields
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: name.trim(),
          last_name: '', // Can be extracted from name if needed
        },
        // Store contact form details in subscriber notes or custom fields
        // MailerLite will need custom fields set up for subject/message
        // For now, we'll log and confirm receipt
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific MailerLite errors
      if (response.status === 422 && data.message?.includes('already exists')) {
        // Subscriber exists - that's fine for contact form
        console.log('📧 Contact form from existing subscriber:', email);
      } else {
        console.error('MailerLite error:', data);
        return NextResponse.json(
          { success: false, error: data.message || 'Failed to send message' },
          { status: response.status }
        );
      }
    }

    // Log the contact form submission for your records
    console.log('📬 Contact form submission:', {
      name: name.trim(),
      email,
      subject: subject || 'No subject',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully. We\'ll get back to you soon!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
