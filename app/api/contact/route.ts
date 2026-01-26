import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Contact form API endpoint
 * POST /api/contact
 * 
 * Sends contact form submissions via Resend email service
 * Sends notification email to site owner and optional confirmation to user
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

    // Resend API integration
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@healthnutritionhacks.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@healthnutritionhacks.com';

    if (!RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { success: false, error: 'Contact service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send notification email to site owner
    const emailSubject = subject 
      ? `Contact Form: ${subject}` 
      : 'New Contact Form Submission';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; margin-bottom: 5px; display: block; }
            .value { color: #111827; padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #d1d5db; }
            .message { white-space: pre-wrap; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name.trim()}</div>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${email}</div>
              </div>
              ${subject ? `
              <div class="field">
                <span class="label">Subject:</span>
                <div class="value">${subject}</div>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Message:</span>
                <div class="value message">${message.trim()}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the contact form on healthnutritionhacks.com</p>
              <p>Reply directly to this email to respond to ${name.trim()} at ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Contact Form Submission

Name: ${name.trim()}
Email: ${email}
${subject ? `Subject: ${subject}\n` : ''}
Message:
${message.trim()}

---
This message was sent from the contact form on healthnutritionhacks.com
Reply directly to this email to respond to ${name.trim()} at ${email}
    `.trim();

    // Send email to site owner
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email, // Allow replying directly to the user
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    // Log the contact form submission for your records
    console.log('📬 Contact form submission sent:', {
      name: name.trim(),
      email,
      subject: subject || 'No subject',
      messageId: emailResult.data?.id,
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
