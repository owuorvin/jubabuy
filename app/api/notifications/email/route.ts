// app/api/notifications/email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// Validation schema
const emailNotificationSchema = z.object({
  type: z.enum(['listing_submitted', 'listing_approved', 'inquiry_received']),
  listingType: z.enum(['property', 'vehicle', 'land']),
  data: z.object({
    title: z.string(),
    price: z.number(),
    location: z.string().optional(),
    submitterName: z.string(),
    submitterEmail: z.string().email(),
    submitterPhone: z.string(),
    listingId: z.string().optional(),
  }),
});

// Email template for listing submission
function getListingSubmittedTemplate(data: any) {
  return {
    subject: `New ${data.listingType} Listing Submitted - ${data.data.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f5f5f5; padding: 30px; margin-top: 20px; }
          .info-row { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New ${data.listingType.charAt(0).toUpperCase() + data.listingType.slice(1)} Listing Submitted</h1>
          </div>
          
          <div class="content">
            <h2>Listing Details</h2>
            
            <div class="info-row">
              <span class="label">Title:</span> <span class="value">${data.data.title}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Price:</span> <span class="value">$${data.data.price.toLocaleString()}</span>
            </div>
            
            ${data.data.location ? `
            <div class="info-row">
              <span class="label">Location:</span> <span class="value">${data.data.location}</span>
            </div>
            ` : ''}
            
            <h3>Submitter Information</h3>
            
            <div class="info-row">
              <span class="label">Name:</span> <span class="value">${data.data.submitterName}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <span class="value">${data.data.submitterEmail}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Phone:</span> <span class="value">${data.data.submitterPhone}</span>
            </div>
            
            <a href="https://jubabuy.com/admin" class="button">Review in Admin Panel</a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from JubaBuy Ltd.</p>
            <p>© 2024 JubaBuy Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New ${data.listingType} Listing Submitted
      
      Title: ${data.data.title}
      Price: $${data.data.price.toLocaleString()}
      ${data.data.location ? `Location: ${data.data.location}` : ''}
      
      Submitter: ${data.data.submitterName}
      Email: ${data.data.submitterEmail}
      Phone: ${data.data.submitterPhone}
      
      Please review this listing in the admin panel: https://jubabuy.com/admin
    `,
  };
}

// Mock email sending function (replace with actual email service)
async function sendEmail(to: string[], subject: string, html: string, text: string) {
  // In production, integrate with services like:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - Postmark
  
  console.log('Sending email:', {
    to,
    subject,
    preview: text.substring(0, 100) + '...',
  });
  
  // For now, return success
  return { success: true, messageId: `msg_${Date.now()}` };
}

// WhatsApp notification function (requires WhatsApp Business API)
async function sendWhatsAppNotification(phone: string, message: string) {
  // In production, integrate with WhatsApp Business API
  // For now, just log
  console.log('WhatsApp notification:', {
    to: phone,
    message: message.substring(0, 100) + '...',
  });
  
  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = emailNotificationSchema.parse(body);
    
    const recipients = ['info@jubabuy.com', 'sales@jubabuy.com'];
    const template = getListingSubmittedTemplate(data);
    
    // Send email notification
    const emailResult = await sendEmail(
      recipients,
      template.subject,
      template.html,
      template.text
    );
    
    // Send WhatsApp notification (optional)
    const whatsappPhone = '+211981779330'; // Admin WhatsApp number
    const whatsappMessage = `New ${data.listingType} listing submitted: "${data.data.title}" for $${data.data.price.toLocaleString()}. Submitted by ${data.data.submitterName} (${data.data.submitterPhone})`;
    
    const whatsappResult = await sendWhatsAppNotification(whatsappPhone, whatsappMessage);
    
    return NextResponse.json({
      success: true,
      email: emailResult,
      whatsapp: whatsappResult,
    });
  } catch (error) {
    console.error('Notification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Email service configuration helper
export function getEmailConfig() {
  return {
    // SendGrid example
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: 'notifications@jubabuy.com',
      fromName: 'JubaBuy Ltd',
    },
    
    // AWS SES example
    ses: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      fromEmail: 'notifications@jubabuy.com',
    },
    
    // Mailgun example
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      fromEmail: 'notifications@jubabuy.com',
    },
  };
}