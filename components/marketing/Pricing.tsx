export function Pricing() {
  return (
    <section id="pricing" className="container py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-4 text-muted-foreground">Start for free. Upgrade anytime.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-2 text-sm text-muted-foreground">Basic tools with limited usage.</p>
          <p className="mt-4 text-3xl font-bold">$0</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>10 generations / month</li>
            <li>AI Blog Generator</li>
            <li>Email support</li>
          </ul>
        </div>
        <div className="rounded-lg border p-6 ring-2 ring-primary">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2 text-sm text-muted-foreground">For creators and teams.</p>
          <p className="mt-4 text-3xl font-bold">$19<span className="text-base font-normal text-muted-foreground">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Unlimited generations</li>
            <li>All current and future tools</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
