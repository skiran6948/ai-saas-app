import Link from 'next/link'
import { Pricing } from '@/components/marketing/Pricing'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Build content faster with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Generate blogs, emails, and more with our AI-powered tools.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard" className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90">
                Get started
              </Link>
              <Link href="#pricing" className="text-sm font-semibold leading-6">
                See pricing →
              </Link>
            </div>
          </div>
        </section>

        <section className="container grid gap-8 py-12 md:grid-cols-3">
          {[
            {
              title: 'AI Blog Generator',
              description: 'Turn ideas into full-length blog posts in seconds.',
            },
            {
              title: 'Email Writer',
              description: 'Draft professional emails from quick prompts.',
            },
            {
              title: 'Code Explainer',
              description: 'Explain complex code snippets clearly.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </section>

        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
