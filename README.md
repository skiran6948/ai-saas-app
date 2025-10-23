# AI SaaS (Next.js 14, Prisma, Stripe)

A fully functional AI SaaS starter using Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, Stripe, and OpenAI. Includes landing page, authentication, dashboard with usage limits, AI Blog Generator tool, subscriptions, and admin panel.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + next-themes
- Prisma + PostgreSQL
- NextAuth (Google + Email)
- Stripe (Checkout, Billing Portal, Webhooks)
- OpenAI API (GPT-4 family)

## Getting Started

### 1) Clone and install
```bash
pnpm install # or npm install / yarn
```

### 2) Environment variables
Copy `.env.example` to `.env` and fill values:
- NEXTAUTH_URL, NEXTAUTH_SECRET
- DATABASE_URL
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- EMAIL_SERVER, EMAIL_FROM
- OPENAI_API_KEY
- STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_PRO_MONTHLY, STRIPE_WEBHOOK_SECRET
- SITE_URL (for Stripe success/cancel) and ADMIN_EMAILS (comma-separated)

### 3) Database and Prisma
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 4) Run dev server
```bash
pnpm dev
```
Visit `http://localhost:3000`.

## Features

- Landing page with hero, features, pricing, testimonials
- Auth with Google + Email
- Dashboard: plan status, usage this month, tokens, CTA to upgrade or manage billing
- AI Blog Generator: `/tools/blog` with prompt input and generated content
- Stripe: `/api/stripe/checkout`, `/api/stripe/portal`, webhook at `/api/stripe/webhook`
- Admin panel: `/admin` (restrict by `ADMIN_EMAILS`)
- Dark mode toggle

## Adding New AI Tools
Create a new route in `app/api/ai/<tool>/route.ts` calling OpenAI, record usage in `UsageRecord`, and add a UI page under `app/tools/<tool>/page.tsx`. See the blog tool for a simple pattern.

## Deployment (Vercel)
- Set all env vars in Vercel project settings.
- Set `NEXTAUTH_URL` to your production URL.
- Add a Postgres database (Neon/Supabase/Railway) and set `DATABASE_URL`.
- Configure Stripe Webhook to `https://your-domain.com/api/stripe/webhook` with signing secret.
- Push code to GitHub and import to Vercel.

## Security & Notes
- Stripe webhook route expects raw body; Vercel’s Next.js runtime provides it via `req.text()`.
- Ensure `STRIPE_PRICE_PRO_MONTHLY` is a recurring price ID.
- Free plan limit is set in `lib/usage.ts`.

## License
MIT
