# Code Constellation Internships

A premium, dark-themed internship platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Supabase**, **Resend**, and **Razorpay**.

## Features

- 🌌 Space-themed landing page with animated starfield
- 📝 Multi-step application form with validation
- 📧 Automated branded emails via Resend (confirmation + admin notification)
- 💳 Razorpay payment link integration for paid plans
- 🔔 Razorpay webhook for automatic payment status updates
- 🔐 Password-protected admin dashboard
- 📱 Fully mobile-responsive
- ✨ Smooth Framer Motion animations throughout

## Tech Stack

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Framework   | Next.js 14 (App Router)    |
| Language    | TypeScript                 |
| Styling     | Tailwind CSS v4            |
| Animations  | Framer Motion              |
| Database    | Supabase (PostgreSQL)      |
| Email       | Resend                     |
| Payments    | Razorpay Payment Links     |
| Icons       | Lucide React               |
| Deployment  | Vercel                     |

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cc-internship
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following to create the `applications` table:

```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  college_year TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  track TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  portfolio_link TEXT,
  plan TEXT NOT NULL,
  why TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for the application form)
CREATE POLICY "Allow public inserts" ON applications
  FOR INSERT WITH CHECK (true);

-- Allow public reads (for admin view — password gate is client-side)
CREATE POLICY "Allow public reads" ON applications
  FOR SELECT USING (true);

-- Allow public updates (for Razorpay webhook to set status = 'paid')
CREATE POLICY "Allow public updates" ON applications
  FOR UPDATE USING (true) WITH CHECK (true);
```

3. Go to **Settings → API** and copy your **URL** and **anon key**.

### 3. Set Up Resend (Email)

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the [API Keys page](https://resend.com/api-keys)
3. (Optional) Verify your domain for branded sender addresses — otherwise emails are sent from `onboarding@resend.dev`

### 4. Set Up Razorpay (Payments)

1. Create **Payment Links** in your [Razorpay Dashboard](https://dashboard.razorpay.com):
   - One for Starter (₹999)
   - One for Pro (₹1,499)
2. Copy the payment link URLs
3. Set up a **Webhook** in Razorpay Dashboard → Webhooks:
   - URL: `https://your-domain.com/api/razorpay-webhook`
   - Event: `payment_link.paid`
   - Copy the webhook secret

### 5. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=your-secret-password
RESEND_API_KEY=re_your_resend_api_key
RAZORPAY_LINK_STARTER=https://rzp.io/your-starter-link
RAZORPAY_LINK_PRO=https://rzp.io/your-pro-link
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Flow

```
Applicant submits form
  │
  ├─ 1. Saved to Supabase (status: 'pending')
  │
  ├─ 2. Confirmation email sent to applicant via Resend
  │     ├─ FREE plan → "You're on the waitlist" message
  │     └─ PAID plan → "Confirm your seat" + Razorpay payment link
  │
  ├─ 3. Admin notification email sent to codeconstellation.business@gmail.com
  │
  └─ 4. (If paid plan) Razorpay webhook fires on payment
        └─ Updates applicant status to 'paid' in Supabase
```

## Pages & API Routes

| Route                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `/`                      | Landing page — hero, tracks, pricing, steps     |
| `/apply`                 | Multi-step application form                     |
| `/admin/applications`    | Password-gated admin view of all applications   |
| `/api/send-emails`       | Sends confirmation + admin notification emails  |
| `/api/admin/verify`      | Server-side admin password verification         |
| `/api/razorpay-webhook`  | Razorpay payment webhook (signature-verified)   |

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add **all** environment variables in the Vercel dashboard
4. Deploy — done!
5. Update your Razorpay webhook URL to `https://your-vercel-domain/api/razorpay-webhook`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, starfield)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Design system + Tailwind
│   ├── apply/page.tsx          # Application form
│   ├── admin/applications/     # Admin dashboard
│   │   └── page.tsx
│   └── api/
│       ├── admin/verify/       # Admin password verification
│       │   └── route.ts
│       ├── send-emails/        # Email sending (Resend)
│       │   └── route.ts
│       └── razorpay-webhook/   # Razorpay payment webhook
│           └── route.ts
├── components/
│   ├── Starfield.tsx           # Animated star canvas background
│   ├── Navbar.tsx              # Sticky glassmorphism navigation
│   ├── Footer.tsx              # Footer with branding
│   ├── HeroSection.tsx         # Landing hero
│   ├── TracksSection.tsx       # 6 internship track cards
│   ├── PricingSection.tsx      # 3 pricing tiers
│   ├── HowItWorks.tsx          # 4-step process
│   ├── GlassCard.tsx           # Reusable glass card
│   ├── AnimatedSection.tsx     # Scroll-triggered animation wrapper
│   └── ApplicationForm.tsx     # Multi-step form + email trigger
└── lib/
    └── supabase.ts             # Supabase client + types
```

## Brand

- **Company**: Code Constellation
- **Udyam Reg**: UDYAM-TN-04-0129239
- **Website**: [codeconstellation.in](https://codeconstellation.in)
- **Tagline**: "We Build It. You Just Present It."

---

Built with 💜 by Code Constellation
