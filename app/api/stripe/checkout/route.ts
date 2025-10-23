import { stripe, PRICE_PRO_MONTHLY, getSiteUrl } from '@/lib/billing'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.email) {
    return new NextResponse('User email required', { status: 400 })
  }

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } })
    customerId = customer.id
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: PRICE_PRO_MONTHLY, quantity: 1 }],
    success_url: `${getSiteUrl()}/dashboard?upgraded=1`,
    cancel_url: `${getSiteUrl()}/pricing`,
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: checkout.url })
}
