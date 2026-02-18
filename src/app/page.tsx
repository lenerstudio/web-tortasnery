import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { Authority } from "@/components/sections/authority"
import { Audience } from "@/components/sections/audience"
import { Problem } from "@/components/sections/problem"
import { Services } from "@/components/sections/services"
import { Offer } from "@/components/sections/offer"
import { Testimonials } from "@/components/sections/testimonials"
import { Warranty } from "@/components/sections/warranty"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <Hero />
      <Authority />
      <Audience />
      <Problem />
      <Services />
      <Offer />
      <Testimonials />
      <Warranty />
      <CTA />
      <Footer />
    </main>
  )
}
