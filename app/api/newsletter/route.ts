import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter subscription API endpoint
 * POST /api/newsletter
 * 
 * Currently logs to console - replace with actual email service integration
 * (e.g., Resend, MailerLite, Brevo, ConvertKit, etc.)
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

    // =============================================================
    // TODO: Replace this section with your email service integration
    // =============================================================
    
    // For now, just log to console
    console.log('📧 Newsletter subscription:', email);
    console.log('Timestamp:', new Date().toISOString());

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // =============================================================
    // Example integration patterns:
    // =============================================================
    
    // RESEND:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID,
    // });

    // MAILERLITE:
    // const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
    //   },
    //   body: JSON.stringify({ email }),
    // });

    // BREVO (Sendinblue):
    // const response = await fetch('https://api.brevo.com/v3/contacts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'api-key': process.env.BREVO_API_KEY,
    //   },
    //   body: JSON.stringify({ email, listIds: [2] }),
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
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
