import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  return email ? list.includes(email.toLowerCase()) : false
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) return notFound()

  const [users, subs, revenueCents] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, createdAt: true } }),
    prisma.subscription.findMany({ select: { id: true, userId: true, status: true, priceId: true } }),
    // Simplified revenue: count active subs * 1900 (assuming $19)
    prisma.subscription.count({ where: { status: { in: ['active', 'trialing'] } } }).then((n) => n * 1900),
  ])

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">Users</div>
          <div className="mt-1 text-xl font-semibold">{users.length}</div>
        </div>
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">Subscriptions</div>
          <div className="mt-1 text-xl font-semibold">{subs.length}</div>
        </div>
        <div className="rounded-lg border p-6">
          <div className="text-sm text-muted-foreground">MRR (approx)</div>
          <div className="mt-1 text-xl font-semibold">${(revenueCents / 100).toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {users.slice(0, 10).map((u) => (
              <li key={u.id} className="flex justify-between"><span>{u.email}</span><span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Subscriptions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {subs.slice(0, 10).map((s) => (
              <li key={s.id} className="flex justify-between"><span>{s.userId}</span><span className="text-muted-foreground">{s.status}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
