# Resend Email Setup for Contact Form

## Overview
The contact form now uses Resend to send email notifications when users submit the contact form.

## Environment Variables Required

Add the following to your `.env.local` file (or `.env` for production):

```env
# Resend API Key (required)
RESEND_API_KEY=re_RgF5b6CW_48FrfZmdk3zLQWf1vNZv4Qct

# Contact email where form submissions are sent (optional, defaults to info@healthnutritionhacks.com)
CONTACT_EMAIL=info@healthnutritionhacks.com

# From email address (optional, defaults to noreply@healthnutritionhacks.com)
# Note: This must be a verified domain in Resend
FROM_EMAIL=noreply@healthnutritionhacks.com
```

## Setup Steps

1. **Add API Key to Environment**
   - Add `RESEND_API_KEY` to your `.env.local` file with the provided key
   - For production, add it to your hosting platform's environment variables

2. **Verify Domain in Resend** (Important!)
   - Log into your Resend dashboard: https://resend.com
   - Go to Domains section
   - Add and verify `healthnutritionhacks.com` domain
   - This is required to send emails from your custom domain
   - Until domain is verified, you may need to use Resend's default sending domain

3. **Configure Email Addresses** (Optional)
   - `CONTACT_EMAIL`: Where contact form submissions are sent (defaults to info@healthnutritionhacks.com)
   - `FROM_EMAIL`: The "from" address for emails (defaults to noreply@healthnutritionhacks.com)
   - Both should use your verified domain

## How It Works

1. User submits contact form with: name, email, subject (optional), message
2. API validates the input
3. Email is sent to `CONTACT_EMAIL` with:
   - Formatted HTML email with all contact details
   - Plain text version for email clients
   - Reply-to set to user's email (so you can reply directly)
4. User receives success confirmation

## Email Features

- **HTML Email**: Professionally formatted with styling
- **Plain Text Fallback**: For email clients that don't support HTML
- **Reply-To**: Set to user's email for easy responses
- **Subject Line**: Includes user's subject if provided, or default message
- **All Fields**: Name, email, subject (if provided), and message are included

## Testing

1. Fill out the contact form on `/contact`
2. Submit the form
3. Check the email inbox configured in `CONTACT_EMAIL`
4. Verify the email contains all form data
5. Test replying to the email (should go to the user's email)

## Troubleshooting

- **"Contact service not configured"**: Check that `RESEND_API_KEY` is set in environment variables
- **Email not received**: 
  - Check Resend dashboard for delivery status
  - Verify domain is verified in Resend
  - Check spam folder
- **Domain verification issues**: 
  - Ensure DNS records are correctly configured
  - Wait for DNS propagation (can take up to 48 hours)
  - Use Resend's default domain for testing if needed

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- The API key provided should be kept secure
- Consider rotating API keys periodically
