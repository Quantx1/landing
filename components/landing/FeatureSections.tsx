'use client'

/**
 * FeatureSections, the core of the premium feature-sell landing: a sequence of
 * alternating feature "sell-pages", each one a mini-landing for a real Quant X
 * capability.
 *
 * Pattern (mirrors the category-leading AI-platform feature blocks + their
 * per-feature sell-pages): mono eyebrow → bold Plus-Jakarta headline (signature
 * gradient on the key phrase, sparingly) → confident value-prop copy → a row
 * of honest capability points → a framed PRODUCT RENDER (our real UI) on the
 * opposite side, floating on a clean radial glow. Composition alternates
 * left/right and varies per section (gpt-taste: not the same Left/Right twice).
 *
 * Generous editorial rhythm: each section gets ~py-24/28 vertical breathing
 * room (the founder's spacing fix), max-w-7xl 1440-class container.
 *
 * Honest: capability claims, not fabricated win-rates; the renders are the
 * product, never a results claim. Brand firewall, public engine names only.
 */

import Link from 'next/link'
import { ArrowUpRight, Check } from '@/lib/icons'

import { Reveal } from './_reveal'
import { BrowserFrame } from './mockups/BrowserFrame'
import { SignalMockup, ScannerMockup, CopilotMockup, DoctorMockup } from './mockups/Mockups'

interface Feature {
  eyebrow: string
  title: React.ReactNode
  body: string
  points: string[]
  href: string
  cta: string
  url: string
  mockup: React.ReactNode
  /** violet AI accent (Copilot) */
  ai?: boolean
}

const FEATURES: Feature[] = [
  {
    eyebrow: 'Machine-Learning Signal Engines',
    title: (
      <>
        The engines all weigh in before a{' '}
        <span className="text-gradient font-bold">signal</span> hits your screen.
      </>
    ),
    body: 'Machine-learning engines rank the board, Regime gates the tape, Mood reads the news, and Counterpoint argues the other side. No signal ships until they agree and the gate clears. Every call lands with an entry, a hard stop, a target and a reason in plain English.',
    points: ['Entry, stop, target on every call', 'Engine consensus plus confidence', 'Paper-trade any of them free'],
    href: '/signals',
    cta: 'Explore signals',
    url: 'quantx.app/signals',
    mockup: <SignalMockup />,
  },
  {
    eyebrow: 'Real-Time AI Scanner',
    title: (
      <>
        Sweep <span className="text-gradient font-bold">1,800+ NSE stocks</span> for setups, live.
      </>
    ),
    body: '50+ real-time screeners and 11 chart patterns run nonstop across the main board. Filter by breakout, momentum, delivery surge or fundamentals, or just describe the setup and let the AI find it. Found a match? Fire it straight to a signal, a chart or your watchlist.',
    points: ['50+ real-time screeners', '11 classic chart patterns', 'Describe a setup, AI finds it'],
    href: '/scanner-lab',
    cta: 'Open the AI Scanner',
    url: 'quantx.app/scanner-lab',
    mockup: <ScannerMockup />,
  },
  {
    eyebrow: 'Trading Copilot',
    title: (
      <>
        Ask anything. Get a <span className="text-ai font-bold">streamed answer</span>, chart attached.
      </>
    ),
    body: 'Your AI trading copilot reads the same ML engines and live data the rest of the app runs on. Ask why a stock moved, what a signal means, or where your book stands. It answers in plain English with real charts streamed inline. No chatbot fluff.',
    points: ['Grounded in live engine output', 'Streams real charts inline', 'Explains any signal on demand'],
    href: '/assistant',
    cta: 'Meet Copilot',
    url: 'quantx.app/assistant',
    ai: true,
    mockup: <CopilotMockup />,
  },
  {
    eyebrow: 'AI Portfolio Doctor',
    title: (
      <>
        A second opinion on your <span className="text-gradient font-bold">whole book.</span>
      </>
    ),
    body: 'An AI agent runs a full pass over concentration, sector balance, momentum and drawdown risk. Graded, explained, grounded in real fundamentals. Know where the book breaks before the market does.',
    points: ['Concentration and sector checks', 'Momentum and drawdown risk', 'Grounded in real fundamentals'],
    href: '/assistant',
    cta: 'Run a review',
    url: 'quantx.app/portfolio',
    mockup: <DoctorMockup />,
  },
]

export default function FeatureSections() {
  return (
    <div id="features" className="scroll-mt-24">
      {FEATURES.map((f, i) => (
        <FeatureBlock key={f.eyebrow} feature={f} flip={i % 2 === 1} />
      ))}
    </div>
  )
}

function FeatureBlock({ feature, flip }: { feature: Feature; flip: boolean }) {
  const { ai } = feature
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28 lg:px-8">
        {/* ── Copy ── */}
        <Reveal className={flip ? 'lg:order-2' : ''}>
          <p
            className={`font-mono text-[11px] uppercase tracking-[0.18em] ${ai ? 'text-ai' : 'text-d-text-muted'}`}
          >
            {feature.eyebrow}
          </p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.08] text-d-text-primary">
            {feature.title}
          </h2>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-d-text-secondary">{feature.body}</p>

          <ul className="mt-6 space-y-2.5">
            {feature.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] text-d-text-primary">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    ai ? 'bg-ai/15 text-ai' : 'bg-up/15 text-up'
                  }`}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <Link
            href={feature.href}
            className="group mt-8 inline-flex items-center gap-2 rounded-pill border border-line px-5 py-2.5 text-[13.5px] font-semibold text-d-text-primary transition-colors hover:bg-hover"
          >
            {feature.cta}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-hover transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>
        </Reveal>

        {/* ── Mockup ── the product render floats on a clean radial depth pool
            (violet for the AI/Copilot section, signature emerald elsewhere). */}
        <Reveal delay={0.08} className={`relative ${flip ? 'lg:order-1' : ''}`}>
          <div
            aria-hidden
            className={`${ai ? 'bg-radial-glow-ai' : 'bg-radial-glow'} absolute -inset-8 -z-10`}
          />
          <BrowserFrame url={feature.url}>
            {feature.mockup}
          </BrowserFrame>
        </Reveal>
      </div>
    </section>
  )
}
