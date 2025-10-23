import { prisma } from './prisma'

export const FREE_LIMIT_PER_MONTH = 10

export async function getUserUsageThisMonth(userId: string) {
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  const usage = await prisma.usageRecord.aggregate({
    _sum: { tokens: true },
    where: { userId, createdAt: { gte: start } },
  })
  const count = await prisma.usageRecord.count({ where: { userId, createdAt: { gte: start } } })
  return { tokens: usage._sum.tokens || 0, count }
}

export async function hasProSubscription(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { in: ['active', 'trialing'] } },
  })
  return Boolean(sub)
}
