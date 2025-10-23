"use client"

import { useState } from 'react'

export default function BlogToolPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOutput('')
    try {
      const res = await fetch('/api/ai/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to generate')
      }
      const data = await res.json()
      setOutput(data.content)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-semibold">AI Blog Generator</h1>
      <p className="mt-2 text-sm text-muted-foreground">Describe your topic and we’ll draft a post.</p>

      <form onSubmit={onGenerate} className="mt-6 space-y-4">
        <textarea
          className="min-h-[120px] w-full rounded-md border p-3"
          placeholder="e.g., Benefits of serverless architectures for startups"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-destructive p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {output && (
        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          {output.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}
