'use client'

/**
 * PricingPreview, 3-tier teaser. ONE source of truth for the headline
 * prices + caps: Free ₹0 / Pro ₹999 / Elite ₹1,999, Copilot 5 / 50 /
 * unlimited (matches the real FEATURE_MATRIX + /pricing). v2 refined:
 * hairline cards, signature accent on the popular tier, token-driven CTAs
 * (no white-on-white), scroll reveal. Full comparison lives on /pricing.
 */

import Link from 'next/link'
import { Check, Sparkles } from '@/lib/icons'

import { Reveal, RevealGroup, RevealItem } from './_reveal'

interface Tier {
  name: 'Free' | 'Pro' | 'Elite'
  price: string
  priceSub: string
  positioning: string
  bullets: string[]
  ctaLabel: string
  highlight?: 'popular'
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '₹0',
    priceSub: 'forever',
    positioning: 'Trade every signal with a virtual ₹10,00,000 book. Zero risk.',
    bullets: [
      '1 Alpha Pick per day',
      'Paper portfolio + league',
      'Market regime + track record',
      'Copilot · 5 messages / day',
      'Telegram daily digest',
    ],
    ctaLabel: 'Start free',
  },
  {
    name: 'Pro',
    price: '₹999',
    priceSub: 'per month',
    positioning: 'The full AI signal stack. Built for traders who run their own book.',
    bullets: [
      'Unlimited swing + intraday signals',
      'AI Scanner · 50+ filters · 11 patterns',
      'Weekly momentum top-10',
      'Copilot · 50 messages / day',
      'Portfolio Doctor · monthly',
    ],
    ctaLabel: 'Upgrade to Pro',
    highlight: 'popular',
  },
  {
    name: 'Elite',
    price: '₹1,999',
    priceSub: 'per month',
    positioning: 'Autonomous AutoPilot trades it for you. Straight to your broker account.',
    bullets: [
      'AutoPilot auto-trader',
      'F&O options strategies',
      'Counterpoint debate on every signal',
      'Copilot · unlimited + chart vision',
    ],
    ctaLabel: 'Upgrade to Elite',
  },
]

export default function PricingPreview() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">Pricing</p>
        <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
          Three tiers. Everything in the box.
        </h2>
        <p className="mt-4 text-[15px] text-d-text-secondary">No add-ons, no unbundling. Cancel anytime. Prices exclude GST.</p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3" amount={0.15}>
        {TIERS.map((t) => (
          <RevealItem key={t.name}>
            <TierCard tier={t} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-6 text-center">
        <p className="text-[12px] text-d-text-muted">
          See every line, tier by tier, on{' '}
          <Link href="/pricing" className="text-d-text-primary underline-offset-4 hover:underline">/pricing</Link>.
        </p>
      </Reveal>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  const popular = tier.highlight === 'popular'

  return (
    <div
      className={[
        'relative flex h-full flex-col rounded-[24px] bg-main p-2.5',
        popular ? 'ring-1 ring-primary/30' : '',
      ].join(' ')}
    >
      {popular && (
        <span className="text-on-signature bg-gradient-signature absolute right-5 top-5 z-10 inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          <Sparkles className="h-3 w-3" />
          Popular
        </span>
      )}

      <div className="flex flex-1 flex-col rounded-[18px] bg-wrap p-6">
      <div className="relative">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-d-text-muted">{tier.name}</h3>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="numeric heading-display text-[34px] font-bold text-d-text-primary">{tier.price}</span>
          <span className="text-[12px] text-d-text-muted">{tier.priceSub}</span>
        </div>
        <p className="mt-2 text-[13px] text-d-text-secondary">{tier.positioning}</p>
      </div>

      <ul className="relative mb-6 mt-5 flex-1 space-y-2.5">
        {tier.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[13px] text-d-text-primary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-up" />
            {b}
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={[
          'relative block rounded-pill py-2.5 text-center text-[13px] font-semibold transition-transform active:scale-[0.97]',
          popular
            ? 'bg-gradient-cta cta-gloss text-on-signature'
            : 'border border-line text-d-text-primary hover:bg-hover',
        ].join(' ')}
      >
        {tier.ctaLabel}
      </Link>
      </div>
    </div>
  )
}
