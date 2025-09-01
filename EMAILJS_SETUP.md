<!-- @format -->

# EmailJS Setup Guide

This guide will help you set up EmailJS to enable email functionality in your contact form.

## Prerequisites

- An EmailJS account (free tier available)
- A Gmail, Outlook, or other email service account

## Step 1: Sign Up for EmailJS

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Click "Sign Up" and create an account
3. Verify your email address

## Step 2: Create an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 3: Create an Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Design your email template using the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{from_phone}}` - Sender's phone number
   - `{{message}}` - Sender's message
   - `{{to_name}}` - Recipient's name
4. Save the template and note down your **Template ID**

## Step 4: Get Your Public Key

1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

## Step 5: Update Configuration

1. Open `src/config/emailjs.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
export const EMAILJS_CONFIG = {
	PUBLIC_KEY: "your_actual_public_key_here",
	SERVICE_ID: "your_actual_service_id_here",
	TEMPLATE_ID: "your_actual_template_id_here",
};
```

## Step 6: Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the contact form
3. Fill out and submit the form
4. Check your email to confirm the message was received

## Troubleshooting

### Common Issues

1. **"Failed to send message" error**

   - Check that all IDs are correctly entered
   - Verify your email service is properly configured
   - Check the browser console for detailed error messages

2. **Email not received**

   - Check your spam folder
   - Verify the email template variables match your form data
   - Ensure your email service has proper permissions

3. **CORS errors**
   - EmailJS handles CORS automatically, but ensure you're using the latest version

### Security Notes

- Never commit your actual EmailJS credentials to version control
- Consider using environment variables for production deployments
- The public key is safe to expose in client-side code

## Environment Variables (Optional)

For production deployments, you can use environment variables:

1. Create a `.env` file in your project root:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

2. Update `src/config/emailjs.ts`:

```typescript
export const EMAILJS_CONFIG = {
	PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
	SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
	TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
};
```

## Support

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Community](https://community.emailjs.com/)
- [GitHub Issues](https://github.com/emailjs/emailjs-javascript/issues)
