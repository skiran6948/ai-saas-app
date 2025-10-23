"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-md border px-3 py-1 text-sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
