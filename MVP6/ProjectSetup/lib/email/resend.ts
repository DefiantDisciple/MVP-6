/**
 * Email service using Resend API
 */

import { Resend } from "resend"

// Lazy initialize Resend client (avoid build-time errors if API key not set)
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend as Resend
}

export interface InviteEmailData {
  toEmail: string
  toName: string
  organizationName: string
  role: string
  inviteToken: string
  expiresInHours: number
  invitedByName: string
}

/**
 * Send invite email via Resend
 */
export async function sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Resend] RESEND_API_KEY not configured")
      return {
        success: false,
        error: "Email service not configured. Please set RESEND_API_KEY environment variable.",
      }
    }

    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/accept-invite?token=${data.inviteToken}`

    const client = getResendClient()
    const { data: result, error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "VerDEX Systems <invites@verdex.systems>",
      to: [data.toEmail],
      subject: "You've been invited to VerDEX Systems",
      html: generateInviteEmailHTML(data, acceptUrl),
      text: generateInviteEmailText(data, acceptUrl),
    })

    if (error) {
      console.error("[Resend] Email send error:", error)
      return {
        success: false,
        error: error.message || "Failed to send email",
      }
    }

    console.log("[Resend] Email sent successfully:", result?.id)
    return { success: true }
  } catch (error: any) {
    console.error("[Resend] Unexpected error:", error)
    return {
      success: false,
      error: error.message || "Unexpected error sending email",
    }
  }
}

/**
 * Generate HTML email template
 */
function generateInviteEmailHTML(data: InviteEmailData, acceptUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to VerDEX Systems</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">VerDEX Systems</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Procurement Platform Invitation</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1f2937; margin-top: 0;">Hello ${data.toName || 'there'},</h2>
      
      <p style="font-size: 16px;">
        ${data.invitedByName} has invited you to join <strong>${data.organizationName}</strong> on the VerDEX Systems procurement platform.
      </p>
      
      <div class="info-box">
        <strong>Your Role:</strong> ${data.role}<br>
        <strong>Organization:</strong> ${data.organizationName}
      </div>
      
      <p>Click the button below to accept your invitation and set up your account:</p>
      
      <div style="text-align: center;">
        <a href="${acceptUrl}" class="button">Accept Invitation</a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">
        Or copy and paste this link into your browser:<br>
        <a href="${acceptUrl}" style="color: #667eea; word-break: break-all;">${acceptUrl}</a>
      </p>
      
      <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 6px; margin: 20px 0;">
        <strong>⚠️ Important:</strong> This invitation expires in ${data.expiresInHours} hours.
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} VerDEX Systems. All rights reserved.</p>
      <p>Secure Procurement Platform</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text email
 */
function generateInviteEmailText(data: InviteEmailData, acceptUrl: string): string {
  return `
VerDEX Systems - Invitation to Join

Hello ${data.toName || 'there'},

${data.invitedByName} has invited you to join ${data.organizationName} on the VerDEX Systems procurement platform.

Your Role: ${data.role}
Organization: ${data.organizationName}

To accept your invitation and set up your account, visit:
${acceptUrl}

IMPORTANT: This invitation expires in ${data.expiresInHours} hours.

If you didn't expect this invitation, you can safely ignore this email.

---
© ${new Date().getFullYear()} VerDEX Systems. All rights reserved.
  `.trim()
}
