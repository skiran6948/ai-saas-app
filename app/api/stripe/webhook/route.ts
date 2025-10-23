import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/billing'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        if (session.customer && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const price = subscription.items.data[0]?.price
          const customer = await stripe.customers.retrieve(session.customer as string)
          const userId = (customer as any).metadata?.userId
          if (userId) {
            await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: session.customer } })
            await prisma.subscription.upsert({
              where: { stripeSubscriptionId: subscription.id },
              update: {
                priceId: price?.id || 'unknown',
                status: subscription.status,
                quantity: subscription.items.data[0]?.quantity || 1,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              },
              create: {
                userId,
                stripeSubscriptionId: subscription.id,
                priceId: price?.id || 'unknown',
                status: subscription.status,
                quantity: subscription.items.data[0]?.quantity || 1,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              },
            })
          }
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const price = subscription.items.data[0]?.price
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        const userId = (customer as any).metadata?.userId
        if (userId) {
          if (event.type === 'customer.subscription.deleted') {
            await prisma.subscription.deleteMany({ where: { stripeSubscriptionId: subscription.id } })
          } else {
            await prisma.subscription.upsert({
              where: { stripeSubscriptionId: subscription.id },
              update: {
                priceId: price?.id || 'unknown',
                status: subscription.status,
                quantity: subscription.items.data[0]?.quantity || 1,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              },
              create: {
                userId,
                stripeSubscriptionId: subscription.id,
                priceId: price?.id || 'unknown',
                status: subscription.status,
                quantity: subscription.items.data[0]?.quantity || 1,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              },
            })
          }
        }
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error('Stripe webhook handling error', e)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }
