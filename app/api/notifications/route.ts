import { NextRequest, NextResponse } from 'next/server';
import { logNotificationToFirebase } from '@/lib/firebaseService';
import { sendEmail } from '@/lib/nodemailerService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = 'email', recipient, subject, message, details } = body;

    if (!recipient || !subject) {
      return NextResponse.json(
        { success: false, error: 'Recipient and subject are required.' },
        { status: 400 }
      );
    }

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #ffffff;">
        <h2 style="color: #2384ba;">Arcanum Notification Service</h2>
        <p>${message || 'System notification event triggered.'}</p>
        <pre style="background: #1e293b; padding: 10px; border-radius: 6px;">${JSON.stringify(details || {}, null, 2)}</pre>
      </div>
    `;

    const result = await sendEmail({
      to: recipient,
      subject,
      html: htmlContent,
    });

    await logNotificationToFirebase({
      type,
      recipient,
      subject,
      status: result.success ? 'sent' : 'failed',
      details,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      status: 'Notification processed and logged in Firebase',
    });
  } catch (error: any) {
    console.error('[API /api/notifications Exception]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch notification.' },
      { status: 500 }
    );
  }
}
