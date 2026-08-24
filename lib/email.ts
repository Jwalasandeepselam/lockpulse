import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey && resendApiKey !== 'mock-resend-key' ? new Resend(resendApiKey) : null;

const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'security@lockpulse.app';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Sends a transactional email via Resend (or logs a simulation in dev mode).
 */
export async function sendTransactionalEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailSendResult> {
  if (!resend) {
    console.log(`[Resend Dev Simulation] Email sent to: ${to} | Subject: "${subject}"`);
    return { success: true, messageId: `mock-resend-${Date.now()}`, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: `LockPulse Security <${SENDER_EMAIL}>`,
      to: [to],
      subject,
      html,
    });
    return { success: true, messageId: data.data?.id };
  } catch (error: any) {
    console.error('Failed to send transactional email via Resend:', error);
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// Transactional Email HTML Templates with LockPulse Branding
// -------------------------------------------------------------

export function createWelcomeEmailHtml(name: string, verifyLink: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #EEF2F6; color: #1E293B; margin: 0; padding: 24px; }
      .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      .header { text-align: center; margin-bottom: 24px; }
      .logo { font-size: 24px; font-weight: 800; color: #0284C7; letter-spacing: -0.5px; }
      .badge { display: inline-block; padding: 4px 12px; background: #E0F2FE; color: #0369A1; border-radius: 999px; font-size: 12px; font-weight: 600; margin-top: 8px; }
      .btn { display: inline-block; background: #0284C7; color: #FFFFFF !important; font-weight: 600; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 20px 0; }
      .footer { text-align: center; font-size: 12px; color: #64748B; margin-top: 32px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="logo">⚡ LOCKPULSE</div>
        <div class="badge">Your Personal Security Network</div>
      </div>
      <h2>Welcome to LockPulse, ${name}</h2>
      <p>Your laptop security control plane is ready. Verify your email to activate device pairing, real-time unlock alerts, and instant remote lockdown.</p>
      <div style="text-align: center;">
        <a href="${verifyLink}" class="btn">Verify Account & Protect Devices</a>
      </div>
      <p style="font-size: 13px; color: #64748B;">This link will expire in 24 hours. If you did not create a LockPulse account, please ignore this email.</p>
      <div class="footer">
        © ${new Date().getFullYear()} LockPulse Inc. • Your laptop. Your control. Wherever you are.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function createSuspiciousUnlockEmailHtml({
  deviceName,
  time,
  portalUrl,
}: {
  deviceName: string;
  time: string;
  portalUrl: string;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #EEF2F6; color: #1E293B; margin: 0; padding: 24px; }
      .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border-top: 6px solid #EF4444; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      .header { text-align: center; margin-bottom: 20px; }
      .alert-tag { display: inline-block; padding: 6px 14px; background: #FEE2E2; color: #DC2626; border-radius: 8px; font-size: 13px; font-weight: 700; }
      .btn-lock { display: inline-block; background: #EF4444; color: #FFFFFF !important; font-weight: 700; padding: 14px 30px; border-radius: 10px; text-decoration: none; margin: 16px 0; }
      .meta-box { background: #F8FAFC; border-radius: 10px; padding: 16px; margin: 16px 0; font-size: 14px; }
      .footer { text-align: center; font-size: 12px; color: #64748B; margin-top: 32px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="alert-tag">⚠️ HIGH PRIORITY SECURITY ALERT</div>
      </div>
      <h2 style="margin-top: 0; color: #0F172A;">Was this you?</h2>
      <p>Your <strong>${deviceName}</strong> was unlocked while your phone appeared to be away.</p>
      
      <div class="meta-box">
        <div><strong>Device:</strong> ${deviceName}</div>
        <div><strong>Detected Time:</strong> ${time}</div>
        <div><strong>Proximity Status:</strong> Phone Away (Out of range)</div>
      </div>

      <div style="text-align: center;">
        <a href="${portalUrl}" class="btn-lock">Lock Laptop & Review Security</a>
      </div>

      <p style="font-size: 13px; color: #64748B;">If this was you, you can confirm it directly in the LockPulse app to dismiss this warning.</p>
      <div class="footer">
        LockPulse Security Dispatch • Cryptographically verified event
      </div>
    </div>
  </body>
  </html>
  `;
}

export function createNewDeviceConnectedEmailHtml({
  deviceName,
  osName,
  time,
}: {
  deviceName: string;
  osName: string;
  time: string;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #EEF2F6; color: #1E293B; margin: 0; padding: 24px; }
      .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border-top: 6px solid #10B981; }
      .badge { display: inline-block; padding: 4px 12px; background: #D1FAE5; color: #065F46; border-radius: 8px; font-size: 13px; font-weight: 600; }
      .meta { background: #F8FAFC; border-radius: 10px; padding: 14px; margin: 16px 0; font-size: 14px; }
      .footer { text-align: center; font-size: 12px; color: #64748B; margin-top: 24px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">✓ New Device Protected</div>
      <h2>New Laptop Connected</h2>
      <p>A new laptop was successfully paired with your LockPulse account.</p>
      <div class="meta">
        <div><strong>Device:</strong> ${deviceName}</div>
        <div><strong>OS:</strong> ${osName}</div>
        <div><strong>Paired At:</strong> ${time}</div>
      </div>
      <p style="font-size: 13px; color: #64748B;">If you did not authorize this connection, immediately sign into LockPulse and revoke the device.</p>
      <div class="footer">© LockPulse Security</div>
    </div>
  </body>
  </html>
  `;
}
