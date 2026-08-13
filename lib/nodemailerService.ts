import nodemailer from 'nodemailer';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
  mock?: boolean;
}

// Create Nodemailer transport dynamically from environment variables
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Ignore default placeholder credentials to prevent bad login attempts
  if (host && user && pass && pass !== 'your_app_password_here' && !user.includes('your_')) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback test/mock transporter logging for development
  return null;
}

/**
 * Send email using Nodemailer
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams): Promise<SendEmailResult> {
  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'Arcanum IT <info@arcanum.ae>';

  if (!transporter) {
    console.log('[Nodemailer Dev Mode] SMTP credentials not set or using placeholder. Logged email payload:');
    console.log(` -> To: ${to}`);
    console.log(` -> Subject: ${subject}`);
    return { success: true, messageId: `mock-email-${Date.now()}`, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      replyTo,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    if (error?.code === 'EAUTH' || error?.responseCode === 535) {
      console.warn(
        '[Nodemailer Warning] Gmail / SMTP 535 Bad Credentials. Please create a 16-character Google App Password in your Google Account Security settings and put it in .env (SMTP_PASS).'
      );
    } else {
      console.error('[Nodemailer Error]', error?.message || error);
    }
    throw error;
  }
}

/**
 * Build branded HTML email template for Arcanum inquiries
 */
export function buildInquiryEmailHtml(data: { name: string; email: string; module: string; message: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-w: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 30px; }
          .header { border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 20px; }
          .badge { color: #2384ba; font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
          .title { font-size: 20px; font-weight: 600; color: #ffffff; margin-top: 8px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-family: monospace; }
          .value { font-size: 15px; color: #cbd5e1; margin-top: 4px; line-height: 1.5; }
          .highlight { color: #2384ba; font-weight: 600; }
          .footer { border-top: 1px solid #334155; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">/// NEW TECHNICAL ENGAGEMENT INQUIRY</div>
            <div class="title">Arcanum Information Technology</div>
          </div>
          <div class="field">
            <div class="label">Client / Inquiry Name</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${data.email}" style="color: #2384ba; text-decoration: none;">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Interested Module / System</div>
            <div class="value highlight">${data.module}</div>
          </div>
          <div class="field">
            <div class="label">Technical Discovery Details</div>
            <div class="value" style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155;">${data.message || 'No additional message provided.'}</div>
          </div>
          <div class="footer">
            Arcanum IT Backend Dispatch • Timestamp: ${new Date().toISOString()}
          </div>
        </div>
      </body>
    </html>
  `;
}
