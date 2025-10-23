import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasProSubscription, getUserUsageThisMonth, FREE_LIMIT_PER_MONTH } from '@/lib/usage'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/(auth)/login')

  const userId = session.user.id
  const [pro, usage] = await Promise.all([
    hasProSubscription(userId),
    getUserUsageThisMonth(userId),
  ])

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {!pro ? (
            <form action="/api/stripe/checkout" method="post">
              <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Upgrade to Pro</button>
            </form>
          ) : (
            <form action="/api/stripe/portal" method="post">
              <button className="rounded-md border px-4 py-2 text-sm">Manage Billing</button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">Plan</div>
          <div className="mt-1 text-xl font-semibold">{pro ? 'Pro' : 'Free'}</div>
        </div>
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">Generations this month</div>
          <div className="mt-1 text-xl font-semibold">{usage.count}{!pro && ` / ${FREE_LIMIT_PER_MONTH}`}</div>
        </div>
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">Tokens this month</div>
          <div className="mt-1 text-xl font-semibold">{usage.tokens}</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Tools</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link href="/tools/blog" className="rounded-lg border p-6 hover:bg-accent">
            <div className="text-lg font-medium">AI Blog Generator</div>
            <div className="text-sm text-muted-foreground">Turn ideas into posts</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
