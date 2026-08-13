import { NextRequest, NextResponse } from 'next/server';
import { saveInquiryToFirebase, logNotificationToFirebase } from '@/lib/firebaseService';
import { sendEmail, buildInquiryEmailHtml, SendEmailResult } from '@/lib/nodemailerService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, module = 'Accurate ERP', message = '' } = body;

    // Payload validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // 1. Save entry in Firebase Firestore database
    const firebaseResult = await saveInquiryToFirebase({
      name,
      email,
      module,
      message,
      source: 'Arcanum Web Contact Form',
      ip,
      userAgent,
    });

    // 2. Dispatch email notification using Nodemailer
    const receiverEmail = process.env.NOTIFICATION_RECEIVER_EMAIL || 'info@arcanum.ae';
    const emailSubject = `[Inquiry] ${module} - ${name}`;
    const emailHtml = buildInquiryEmailHtml({ name, email, module, message });

    let emailResult: SendEmailResult = { success: false, messageId: '', mock: false };
    try {
      emailResult = await sendEmail({
        to: receiverEmail,
        subject: emailSubject,
        html: emailHtml,
        replyTo: email,
      });

      // 3. Log notification event to Firebase
      await logNotificationToFirebase({
        type: 'email',
        recipient: receiverEmail,
        subject: emailSubject,
        status: 'sent',
        details: { messageId: emailResult.messageId, inquiryId: firebaseResult.id },
      });
    } catch (err: any) {
      console.error('[API /api/contact] Nodemailer dispatch warning:', err?.message || err);
      await logNotificationToFirebase({
        type: 'email',
        recipient: receiverEmail,
        subject: emailSubject,
        status: 'failed',
        details: { error: err?.message || String(err) },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully saved to Firebase backend and email queued.',
      inquiryId: firebaseResult.id,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('[API /api/contact Exception]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing contact submission.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Arcanum Information Technology Contact & Firebase Notification Backend',
    timestamp: new Date().toISOString(),
  });
}
