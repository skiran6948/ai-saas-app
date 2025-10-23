import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: { strategy: 'database' },
  pages: {},
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.stripeCustomerId = (user as any).stripeCustomerId ?? null
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export type AppSessionUser = NextAuthUser & { stripeCustomerId?: string | null }
