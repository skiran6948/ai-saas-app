import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasProSubscription, getUserUsageThisMonth, FREE_LIMIT_PER_MONTH } from '@/lib/usage'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })
  const userId = session.user.id

  const { prompt } = await req.json().catch(() => ({ prompt: '' }))
  if (!prompt || typeof prompt !== 'string') return new NextResponse('Invalid prompt', { status: 400 })

  const pro = await hasProSubscription(userId)
  if (!pro) {
    const usage = await getUserUsageThisMonth(userId)
    if (usage.count >= FREE_LIMIT_PER_MONTH) {
      return new NextResponse('Free limit reached', { status: 402 })
    }
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that writes high-quality blog posts.' },
      { role: 'user', content: `Write a detailed blog post about: ${prompt}. Include headings and a friendly tone.` },
    ],
    temperature: 0.7,
  })

  const text = completion.choices[0]?.message?.content || 'No content generated.'
  const tokens = completion.usage?.total_tokens || text.length / 4

  await prisma.usageRecord.create({ data: { userId, tool: 'blog', tokens: Math.round(tokens) } })

  return NextResponse.json({ content: text })
}
