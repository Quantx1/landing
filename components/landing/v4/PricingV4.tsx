'use client'

/**
 * PricingV4 — landing blueprint item 11 (FintechX 11-tail-b.jpeg).
 *
 * Template-true pricing band: centered eyebrow pill + Bricolage H2, then the
 * measured plan-wrapper specimen — each plan is a tinted rounded-[24px]
 * wrapper with 10px padding holding an inner white card (radius 16px, 30px
 * pad). The featured plan (Pro) wears a blue-tinted wrapper and the glossy
 * blue CTA recipe (bg-gradient-cta + shadow-cta-glow + trailing white arrow
 * chip); the others get the template's ink pill. Blue chevron feature
 * bullets, dotted trust strip, compare-all link. Section rhythm 0 0 200px
 * per SPECIMENS (FaqsV4 follows with pt-0).
 *
 * Plans/copy mirror app/pricing/page.tsx STATIC_PLANS (locked Free ₹0 /
 * Pro ₹999 / Elite ₹1,999 — real backend caps only, never invented limits).
 * SEBI-safe: no return promises, AutoPilot runs on the user's own broker
 * account, public engine names only. CTAs link /pricing.
 *
 * Token classes only (no raw hexes — gloss/ink recipes live in globals.css
 * as .bg-gradient-cta / .shadow-cta-glow / .text-on-signature). Icons from
 * '@/lib/icons'. framer-motion whileInView reveals per FINTECHX-SYSTEM §6;
 * honors reduced motion.
 */

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, ChevronRight } from '@/lib/icons'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

interface Plan {
  id: string
  name: string
  tagline: string
  price: string
  cta: string
  featured?: boolean
  features: string[]
}

/* Feature lists mirror app/pricing/page.tsx STATIC_PLANS — real caps only. */
const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Watch the AI trade. Virtual money, zero risk.',
    price: '0',
    cta: 'Start free',
    features: [
      'Paper AutoPilot trades a virtual portfolio for you',
      '1 Alpha Pick / day',
      'Copilot — 5 messages / day',
      'Paper trading + League',
      'Watchlist (5 symbols)',
      'Telegram daily digest',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Trade with the AI. Or let it trade for you.',
    price: '999',
    cta: 'Get Pro',
    featured: true,
    features: [
      'AutoPilot Lite: live auto-trading up to ₹2,00,000 — on your own broker account',
      'Unlimited swing + intraday signals',
      'Momentum Picks — weekly Top-10',
      'AI Scanner + Setup Finder (AI thesis 30 / day)',
      'Copilot — 150 messages / day',
      'WhatsApp digest + Alerts Studio',
      'Portfolio Doctor 10 / month + Weekly Review',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Full automation. No caps. Full depth.',
    price: '1,999',
    cta: 'Go Elite',
    features: [
      'Everything in Pro',
      'AutoPilot Unlimited: no capital cap, 15 positions',
      'F&O strategies + Options Copilot',
      'Counterpoint debate on signals',
      'Copilot — 400 messages / day',
      'Portfolio Doctor 60 / month',
    ],
  },
]

const TRUST_ITEMS = [
  'Free plan with no time limit',
  'No credit card for Free',
  'Cancel anytime',
  'GST invoice',
]

function PlanCard({ plan, item }: { plan: Plan; item: Variants }) {
  const featured = Boolean(plan.featured)

  return (
    <motion.div
      variants={item}
      className={cn(
        /* Measured specimen: tinted wrapper, radius 24, pad 10; featured
           plan gets the blue-tinted frame. */
        'flex h-full flex-col rounded-[24px] p-[10px]',
        featured ? 'bg-primary/10' : 'bg-main'
      )}
    >
      {/* Inner white card — radius 16, 30px pad, flat (template style). */}
      <div className="flex h-full flex-col rounded-2xl bg-wrap p-6 sm:p-[30px]">
        {/* Name + Popular badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold tracking-[-0.5px] text-d-text-primary">
            {plan.name}
          </h3>
          {featured && (
            <span className="rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-on-signature">
              Popular
            </span>
          )}
        </div>

        <p className="mt-2 text-base font-medium leading-snug text-d-text-secondary">
          {plan.tagline}
        </p>

        {/* Price */}
        <div className="mt-7 flex items-baseline gap-2">
          <span className="font-display text-5xl font-semibold tracking-[-1px] text-d-text-primary sm:text-[56px] sm:leading-none">
            &#8377;{plan.price}
          </span>
          <span className="text-base font-medium text-d-text-muted">
            /month
          </span>
        </div>

        {/* CTA — pill, links to /pricing. Featured = glossy blue recipe
            with the trailing white arrow chip (spec §4 signature CTA);
            others = template ink pill. */}
        {featured ? (
          <Link
            href="/pricing"
            className="cta-gloss group mt-7 flex w-full items-center justify-between rounded-full bg-gradient-cta py-2.5 pl-7 pr-2.5 text-lg font-semibold text-on-signature transition-transform duration-200 hover:-translate-y-0.5"
          >
            {plan.cta}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wrap">
              <ArrowRight
                aria-hidden
                className="h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="mt-7 flex w-full items-center justify-center rounded-full bg-d-text-primary px-[30px] py-3 text-lg font-semibold text-on-signature transition-opacity hover:opacity-90"
          >
            {plan.cta}
          </Link>
        )}

        {/* Feature list — template blue chevron bullets */}
        <ul className="mt-7 space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <ChevronRight
                aria-hidden
                strokeWidth={2.5}
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              />
              <span className="text-base font-medium leading-snug text-d-text-secondary">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function PricingV4() {
  const reduce = useReducedMotion()
  const item = reduce ? fadeVariants : riseVariants

  return (
    /* Template rhythm: pricing pads 0 0 200px (SPECIMENS). */
    <section id="pricing" className="bg-wrap pb-28 pt-0 md:pb-[200px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
          >
            Pricing
          </motion.span>

          <motion.h2
            variants={item}
            className="mt-5 font-display text-4xl font-semibold tracking-[-1px] text-d-text-primary sm:text-5xl"
          >
            Start on paper. Go live when you&rsquo;re ready.
          </motion.h2>

          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-xl text-lg font-medium leading-relaxed text-d-text-secondary"
          >
            Every plan runs the same five engines — Alpha, Mood, Regime,
            AutoPilot and Counterpoint — with hard risk controls built in.
          </motion.p>
        </motion.div>

        {/* ── Plans ───────────────────────────────────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} item={item} />
            ))}
          </div>

          {/* ── Trust strip (template dotted row) ─────────────────── */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2 text-sm font-medium text-d-text-muted sm:text-base"
          >
            {TRUST_ITEMS.map((line, i) => (
              <span key={line} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden className="text-d-text-muted/60">
                    &middot;
                  </span>
                )}
                {line}
              </span>
            ))}
          </motion.div>

          {/* Compare-all link */}
          <motion.div variants={item} className="mt-6 flex justify-center">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-1.5 text-base font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Compare every plan feature
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
