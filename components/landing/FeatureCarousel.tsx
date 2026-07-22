'use client'

/**
 * FeatureCarousel, a horizontal-scroll card wall of capabilities, each topped
 * by a premium product-render image (Quant X take on the category's "AI trading
 * strategies" card grid: image-topped cards, mono eyebrow, bold title, short
 * desc). The imagery is on-brand 3D renders in our palette (near-black canvas,
 * emerald + violet accents). Cards scroll on a snap track with edge fades.
 *
 * Honest: descriptive capability cards, public engine names only.
 */

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@/lib/icons'

import { Reveal } from './_reveal'
import { appUrl } from '@/lib/app-url'

interface Card {
  eyebrow: string
  title: string
  body: string
  href: string
  image: string
  ai?: boolean
}

const CARDS: Card[] = [
  {
    eyebrow: 'ML ensemble',
    title: 'AI Signals',
    body: 'A machine-learning ensemble has to agree before a signal reaches you. Entry, stop, target, and the reason in plain English.',
    href: appUrl('/signals'),
    image: '/images/v3/ai-signal.webp',
  },
  {
    eyebrow: 'ML-ranked',
    title: 'Momentum',
    body: 'The NSE board, machine-trend-ranked. Refreshed every session, so you see what is moving now.',
    href: appUrl('/signals/momentum-picks'),
    image: '/images/v3/ai-momentum.webp',
  },
  {
    eyebrow: 'Regime-aware',
    title: 'Regime',
    body: 'Bull, sideways, or bear. Classified daily, so every engine sizes risk to match the tape.',
    href: '/proof?tab=regime',
    image: '/images/v3/ai-regime.webp',
  },
  {
    eyebrow: 'News sentiment',
    title: 'Mood',
    body: 'AI reads the Indian financial news tape per ticker and scores it. The other side of the chart, on demand.',
    href: appUrl('/stocks'),
    image: '/images/v3/ai-neural.webp',
  },
  {
    eyebrow: 'Autonomous execution',
    title: 'AutoPilot',
    body: 'Autonomously runs the top-ranked names on your broker. Kelly sizing, hard stops, and you stay in control.',
    href: appUrl('/signals'),
    image: '/images/v3/ai-autopilot.webp',
  },
  {
    eyebrow: 'Trading copilot',
    title: 'Copilot',
    body: 'Ask anything about a stock, a signal, or your book. Answered with live charts, not hand-waving.',
    href: appUrl('/assistant'),
    image: '/images/v3/ai-copilot.webp',
    ai: true,
  },
  {
    eyebrow: 'Multi-agent',
    title: 'Trading agents',
    body: 'Specialist AI agents argue the bull case against the bear case, then hand you the call and the why.',
    href: appUrl('/assistant'),
    image: '/images/v3/ai-agents.webp',
    ai: true,
  },
  {
    eyebrow: 'Real-time AI',
    title: 'AI Scanner',
    body: '50+ live screeners and 11 chart patterns sweep 1,800+ stocks in real time. The setup finds you.',
    href: appUrl('/scanner-lab'),
    image: '/images/v3/ai-scanner.webp',
  },
  {
    eyebrow: 'AI risk agent',
    title: 'Portfolio Doctor',
    body: 'Know where your book breaks before it does. An AI-graded review of exposure, concentration, and drawdown risk.',
    href: appUrl('/assistant'),
    image: '/images/v3/ai-risk.webp',
  },
]

export default function FeatureCarousel() {
  return (
    <section className="overflow-hidden py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">The full stack</p>
            <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
              One desk. Every move you{' '}
              <span className="text-gradient font-bold">make.</span>
            </h2>
          </div>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-d-text-muted sm:block">
            Scroll →
          </p>
        </Reveal>
      </div>

      {/* horizontal snap track with edge fades */}
      <div className="mask-edge-fade mt-10">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CARDS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-wrap transition-colors hover:bg-wrap-hover lift sm:w-[320px]"
            >
              {/* premium render top, pinned dark on both themes */}
              <div className="dark-media relative h-[168px] overflow-hidden border-b">
                <Image
                  src={c.image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {/* gentle bottom fade so the title row sits cleanly under the image */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-wrap to-transparent"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                    c.ai ? 'text-ai' : 'text-d-text-muted'
                  }`}
                >
                  {c.eyebrow}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <h3 className="heading-display text-[18px] font-semibold text-d-text-primary">{c.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-d-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-d-text-secondary">{c.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
