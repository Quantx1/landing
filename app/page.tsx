'use client'

/**
 * Landing page — v2.1 "premium feature-sell" (2026-06-20).
 *
 * Premium marketing surface rebuilt to a category-leading feature-sell-page rhythm:
 * a dense, image-rich, alternating-section landing on the ONE signature
 * gradient (emerald→cyan→violet), near-mono token palette, Plus Jakarta
 * display + body + Geist Mono numerics. Works light + dark + mobile.
 *
 * AIDA flow (generous, editorial section rhythm — the founder's spacing fix):
 *   1. Nav (sticky, hairline)
 *   2. Hero — headline + dual CTAs + framed PRODUCT MOCKUP + live overlays
 *   3. Broker trust carousel (honest integrations marquee)
 *   4. Index ticker tape (live publicTrust.indices)
 *   5. Feature sell-sections — 4 alternating mini-landings w/ framed renders
 *   6. AI narrative (#ai) — copilot, agents, autonomous execution + honest gate
 *   7. Feature carousel — horizontal card wall w/ premium product renders
 *   8. Engines bento (#engines) — gapless capability grid
 *   9. How it works (#how-it-works)
 *  10. Trust pillars — honest "why traders trust it" band
 *  11. Track record / proof (live publicTrust.trackRecord)
 *  12. Pricing teaser (#pricing) — Free ₹0 / Pro ₹999 / Elite ₹1,999
 *  13. FAQ accordion
 *  14. Final CTA + Footer
 *
 * Real data wiring preserved end-to-end via api.publicTrust.* (read-only,
 * unauth, CDN-cached) — api.ts is never touched. Mockups render our REAL UI
 * components with clearly illustrative sample values (product screenshots, not
 * live data, not performance claims). Brand firewall + content honesty pass
 * applied (no fabricated stats, no model architectures, SEBI status = pending).
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from '@/lib/icons'

import LightNavbar from '@/components/landing/LightNavbar'
import Hero from '@/components/landing/Hero'
import IndexTicker from '@/components/landing/IndexTicker'
import FeatureSections from '@/components/landing/FeatureSections'
import AgentsSection from '@/components/landing/AgentsSection'
import FeatureCarousel from '@/components/landing/FeatureCarousel'
import EnginesBento from '@/components/landing/EnginesBento'
import HowItWorks from '@/components/landing/HowItWorks'
import TrustPillars from '@/components/landing/TrustPillars'
import TrackRecordBar from '@/components/landing/TrackRecordBar'
import PricingPreview from '@/components/landing/PricingPreview'
import LandingFaq from '@/components/landing/LandingFaq'
import BrandCarousel from '@/components/landing/BrandCarousel'
import Footer from '@/components/landing/Footer'
import { Reveal } from '@/components/landing/_reveal'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Locked IA: signed-in users skip the marketing page and land on /copilot,
  // the single home (WP-SIMPLEVIEW). Managed users get the plain-language
  // Simple view ON there automatically — no separate /home route. Middleware
  // can't see the localStorage session, so the gate lives client-side.
  useEffect(() => {
    if (!loading && user) router.replace('/copilot')
  }, [user, loading, router])

  return (
    <main className="min-h-screen overflow-x-hidden bg-main text-d-text-primary">
      <LightNavbar />

      <Hero />

      {/* Broker integrations — honest (these are the OAuth brokers we connect
          to), placed as a calm trust strip directly under the hero. */}
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <Reveal>
          <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-d-text-muted">
            Connects directly with India&apos;s leading brokers
          </p>
          <BrandCarousel />
        </Reveal>
      </section>

      <IndexTicker />

      {/* The core — alternating feature sell-sections */}
      <FeatureSections />

      {/* The AI narrative — copilot, agents, autonomous execution, honest gate */}
      <AgentsSection />

      {/* Capability card wall (premium product renders) */}
      <FeatureCarousel />

      <EnginesBento />

      <HowItWorks />

      <TrustPillars />

      <TrackRecordBar />

      <PricingPreview />

      <LandingFaq />

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-signature-wash absolute inset-x-0 bottom-0 h-[460px] rotate-180" />
        <div className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
          <Reveal>
            <h2 className="heading-display text-[clamp(2.1rem,4.2vw,3.3rem)] font-semibold leading-[1.08] text-d-text-primary">
              Start paper-trading in{' '}
              <span className="text-gradient font-bold">40 seconds.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-d-text-secondary">
              No broker, no card. A virtual ₹10L portfolio is seeded at signup. Connect
              your broker any time to trade live with your own data.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="bg-gradient-cta group inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[14.5px] font-semibold text-on-signature transition-transform active:scale-[0.97]"
              >
                Start free
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
              <Link
                href="/proof?tab=models"
                className="inline-flex items-center rounded-pill border border-line px-5 py-3 text-[14px] font-medium text-d-text-primary transition-colors hover:bg-hover"
              >
                See live model accuracy
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
