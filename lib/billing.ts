import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY!

export function getSiteUrl() {
  return process.env.SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
}
