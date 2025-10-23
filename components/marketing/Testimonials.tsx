export function Testimonials() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by creators</h2>
        <p className="mt-4 text-muted-foreground">Hear from our users.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            name: 'Alex',
            quote: 'Generated a full blog post in minutes. Amazing!'
          },
          {
            name: 'Priya',
            quote: 'The dashboard and UX are clean and simple.'
          },
          {
            name: 'Sam',
            quote: 'Pro plan is worth every penny.'
          }
        ].map((t) => (
          <div key={t.name} className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">“{t.quote}”</p>
            <p className="mt-4 font-semibold">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
