import { Pricing } from '@/components/marketing/Pricing'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
