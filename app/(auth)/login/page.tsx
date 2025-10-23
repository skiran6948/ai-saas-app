"use client"

import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-6">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome back</p>
        <div className="mt-6 space-y-3">
          <button
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Continue with Google
          </button>
          <button
            className="w-full rounded-md border px-4 py-2 text-sm font-medium"
            onClick={() => signIn('email', { callbackUrl: '/dashboard' })}
          >
            Continue with Email
          </button>
        </div>
        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
