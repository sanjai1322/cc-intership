import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ── POST /api/send-emails ──
// Called client-side after a successful Supabase insert, OR from the admin panel to trigger onboarding.

// Lazy-initialized to avoid build-time crash when env var is not set
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = "Code Constellation <onboarding@resend.dev>"; // Replace with your verified domain

// ── Branded email wrapper ──
function emailWrapper(content: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codeconstellation.in";
  const logoUrl = `${appUrl}/logo.png`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Code Constellation</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f9fc; font-family:'DM Sans', 'Segoe UI', Arial, sans-serif; color:#4b5563;">
  <div style="max-width:600px; margin:0 auto; padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:40px;">
      <img src="${logoUrl}" alt="Code Constellation Logo" style="width:48px; height:48px; border-radius:12px; object-fit:contain;" />
      <h1 style="margin:16px 0 4px; font-family:'Syne','DM Sans',Arial,sans-serif; font-size:22px; font-weight:700; color:#0f0f0f; letter-spacing:-0.3px;">
        Code Constellation
      </h1>
      <p style="margin:0; font-size:13px; color:#9ca3af; font-style:italic;">
        We Build It. You Just Present It.
      </p>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; padding:32px 28px; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center; margin-top:36px; font-size:12px; color:#9ca3af;">
      <p style="margin:0 0 6px;">
        Code Constellation &bull; UDYAM-TN-04-0129239
      </p>
      <p style="margin:0;">
        <a href="https://codeconstellation.in" style="color:#2E50E7; text-decoration:none;">codeconstellation.in</a>
        &nbsp;&bull;&nbsp;
        <a href="https://instagram.com/codeconstellation" style="color:#2E50E7; text-decoration:none;">@codeconstellation</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ── Applicant confirmation email ──
function applicantEmail(name: string, plan: string, track: string): string {
  const firstName = name.split(" ")[0];
  const price = plan === "Starter" ? "₹999" : "₹1,499";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const paymentSection = `
    <div style="margin-top:28px; padding-top:24px; border-top:1px solid #e5e7eb;">
      <h2 style="margin:0 0 12px; font-family:'Syne','DM Sans',Arial,sans-serif; font-size:18px; font-weight:700; color:#0f0f0f;">
        Confirm your seat 🚀
      </h2>
      <p style="margin:0 0 20px; font-size:14px; color:#4b5563; line-height:1.7;">
        You selected the <strong style="color:#2E50E7;">${plan}</strong> plan (${price}). 
        Complete your payment using the UPI details below to lock in your spot — seats are limited and fill fast.
      </p>
      
      <!-- UPI Instructions Box -->
      <div style="background:#f8f9fc; border:1px solid #e5e7eb; border-radius:12px; padding:20px; margin-bottom:20px; text-align:center;">
        <div style="font-size:12px; color:#9ca3af; text-transform:uppercase; font-weight:bold; letter-spacing:0.5px; margin-bottom:4px;">
          UPI ID
        </div>
        <div style="font-family:monospace; font-size:18px; font-weight:bold; color:#0f0f0f; margin-bottom:12px;">
          sanjai131418@okicici
        </div>
        <div style="font-size:12px; color:#9ca3af; text-transform:uppercase; font-weight:bold; letter-spacing:0.5px; margin-bottom:4px;">
          Amount to Pay
        </div>
        <div style="font-size:24px; font-weight:bold; color:#2E50E7;">
          ${price}
        </div>
      </div>

      <p style="margin:0 0 16px; font-size:14px; color:#4b5563; line-height:1.7;">
        👉 <strong>After paying,</strong> upload your payment screenshot so we can verify and activate your seat:
      </p>

      <div style="text-align:center; margin:20px 0;">
        <a href="${appUrl}/verify-payment" style="display:inline-block; background:#2E50E7; color:#ffffff; font-size:15px; font-weight:700; padding:14px 32px; border-radius:10px; text-decoration:none; letter-spacing:0.3px; box-shadow:0 4px 12px rgba(46,80,231,0.25);">
          📤 Upload Payment Screenshot
        </a>
      </div>

      <p style="margin:16px 0 0; font-size:12px; color:#9ca3af; text-align:center; line-height:1.6;">
        Or copy this link: <a href="${appUrl}/verify-payment" style="color:#2E50E7; text-decoration:underline;">${appUrl}/verify-payment</a>
      </p>
      
      <p style="margin:12px 0 0; font-size:12px; color:#9ca3af; text-align:center; font-style:italic;">
        You can pay via GPay, PhonePe, Paytm, or any UPI app.
      </p>
    </div>`;

  const content = `
    <h2 style="margin:0 0 8px; font-family:'Syne','DM Sans',Arial,sans-serif; font-size:20px; font-weight:700; color:#0f0f0f;">
      Hey ${firstName} 👋
    </h2>
    <p style="margin:0 0 16px; font-size:15px; color:#4b5563; line-height:1.7;">
      Your application for <strong style="color:#2E50E7;">${track}</strong> has been received!
    </p>
    <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.7;">
      We review every applicant personally — you'll hear from us within 
      <strong style="color:#0f0f0f;">48 hours</strong>.
    </p>
    ${paymentSection}
  `;

  return emailWrapper(content);
}

// ── Onboarding Email Template ──
function onboardingEmail(name: string, plan: string, track: string): string {
  const firstName = name.split(" ")[0];
  const price = plan === "Starter" ? "₹999" : "₹1,499";
  const todayDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const content = `
    <h2 style="margin:0 0 12px; font-family:'Syne','DM Sans',Arial,sans-serif; font-size:22px; font-weight:700; color:#0f0f0f; text-align:center;">
      Welcome to Code Constellation — you're officially in 🎉
    </h2>
    
    <div style="background:#f8f9fc; border:1px solid #e5e7eb; border-radius:12px; padding:20px; margin:24px 0;">
      <h3 style="margin:0 0 12px; font-size:15px; color:#0f0f0f; font-weight:bold;">Your Internship Details:</h3>
      <table style="width:100%; font-size:14px; color:#4b5563; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#9ca3af; width:120px;">Track</td>
          <td style="padding:6px 0; color:#0f0f0f; font-weight:600;">${track}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#9ca3af;">Plan</td>
          <td style="padding:6px 0; color:#0f0f0f; font-weight:600;">${plan}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#9ca3af;">15-Day Start Date</td>
          <td style="padding:6px 0; color:#2E50E7; font-weight:600;">${todayDate}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 16px; font-size:15px; color:#4b5563; line-height:1.7;">
      👋 <strong>What happens next:</strong> Check WhatsApp — we'll send your Day 1 task brief there.
    </p>

    <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e5e7eb; text-align:center;">
      <span style="display:inline-block; background:#eff2ff; color:#2E50E7; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:bold; border:1px solid #c3dafe;">
        ✅ Payment Confirmed: ${price} received — thank you
      </span>
    </div>
  `;

  return emailWrapper(content);
}

// ── API handler ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application_id, full_name, email, track, plan, action = "apply" } = body;

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping emails.");
      return NextResponse.json({ success: true, warning: "Email service not configured." });
    }

    const resend = getResend();

    if (action === "onboard") {
      console.log('Approve payment called for:', application_id);
      console.log('Application found:', { full_name, email, track, plan });
      console.log('Sending email to:', email);

      // Send onboarding email
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Code Constellation — you're officially in 🎉",
        html: onboardingEmail(full_name, plan, track),
      });

      console.log('Resend response:', data);
      console.log('Resend error:', error);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        emailId: data?.id,
      });
    } else {
      // Default: Send confirmation email to applicant
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Application received — Code Constellation (${track})`,
        html: applicantEmail(full_name, plan, track),
      });

      return NextResponse.json({
        success: true,
        applicantEmailId: result.data?.id,
      });
    }
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process application." },
      { status: 500 }
    );
  }
}
