'use client'

/**
 * Landing page — v4 "FintechX" (2026-07-15, docs/FINTECHX-SYSTEM.md §5).
 *
 * Template-true, light-pinned marketing surface assembled from the 13
 * `components/landing/v4/*` sections in the exact blueprint order:
 *
 *   1. HeroV4          — sky backdrop + floating navbar + XL headline + frame
 *   2. ComparisonV4    — trading alone vs with Quant X
 *   3. FeaturesV4      — 3-col feature cards (#features)
 *   4. OverviewV4      — command-center photographic band
 *   5. StepsV4         — how it works, 3 steps (#how-it-works)
 *   6. SecurityV4      — broker-OAuth trust band
 *   7. UseCasesV4      — persona cards + ticker strip
 *   8. IntegrationsV4  — broker & data integrations
 *   9. StatsV4         — honest big-number stats
 *  10. TestimonialsV4  — photographic band + testimonial ticker
 *  11. PricingV4       — ₹0 / ₹999 / ₹1,999 plans
 *  12. FaqsV4          — accordion
 *  13. CtaFooterV4     — closing CTA band + dark footer
 *
 * HeroV4 owns the navbar; CtaFooterV4 owns the footer. `.light-landing` on
 * the root pins light tokens regardless of the app theme (globals.css).
 * Smooth anchor scrolling comes from the global `html { scroll-behavior }`.
 * Sections manage their own vertical rhythm (SPECIMENS.md 100–200px bands),
 * so the page shell stays minimal. Old `components/landing/*` (non-v4)
 * sections stay on disk but are intentionally unreferenced here.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { HeroV4 } from '@/components/landing/v4/HeroV4'
import { ComparisonV4 } from '@/components/landing/v4/ComparisonV4'
import { FeaturesV4 } from '@/components/landing/v4/FeaturesV4'
import { OverviewV4 } from '@/components/landing/v4/OverviewV4'
import { StepsV4 } from '@/components/landing/v4/StepsV4'
import { SecurityV4 } from '@/components/landing/v4/SecurityV4'
import { UseCasesV4 } from '@/components/landing/v4/UseCasesV4'
import { IntegrationsV4 } from '@/components/landing/v4/IntegrationsV4'
import { StatsV4 } from '@/components/landing/v4/StatsV4'
import { TestimonialsV4 } from '@/components/landing/v4/TestimonialsV4'
import { PricingV4 } from '@/components/landing/v4/PricingV4'
import { FaqsV4 } from '@/components/landing/v4/FaqsV4'
import { CtaFooterV4 } from '@/components/landing/v4/CtaFooterV4'
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
    <main className="light-landing min-h-screen overflow-x-hidden bg-main text-d-text-primary">
      <HeroV4 />
      <ComparisonV4 />
      <FeaturesV4 />
      <OverviewV4 />
      <StepsV4 />
      <SecurityV4 />
      <UseCasesV4 />
      <IntegrationsV4 />
      <StatsV4 />
      <TestimonialsV4 />
      <PricingV4 />
      <FaqsV4 />
      <CtaFooterV4 />
    </main>
  )
}
