'use client'

/**
 * EnginesBento, the AI stack as an Apple-style bento grid.
 *
 * Replaces the old 4-col identical-card FeatureGrid (which had side-stripe
 * borders + a contradictory "12 AI models" claim). Mixed cell sizes,
 * hairline cards, ONE signature-accent feature cell. The five public
 * engines lead (Alpha · Mood · Regime · AutoPilot · Counterpoint —
 * brand-firewall names only), with Copilot, Scanner and Portfolio Doctor
 * as supporting capability cells. Static product facts (not data-driven).
 *
 * Exactly 8 cells for 8 capabilities, no empty tiles. Reveals on scroll
 * via the shared stagger group.
 */

import Image from 'next/image'
import Link from 'next/link'
import {
  Layers,
  Newspaper,
  Gauge,
  Crown,
  Scale,
  MessageSquare,
  ScanSearch,
  Stethoscope,
  ArrowUpRight,
} from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

import { Reveal, RevealGroup, RevealItem } from './_reveal'

interface Cell {
  name: string
  kicker: string
  body: string
  icon: LucideIcon
  href: string
  span: string // grid span classes
  signature?: boolean
  ai?: boolean // violet AI accent, Copilot / agent cells ONLY
  /** Optional on-brand decorative image backdrop (3 cells we have art for).
   *  Rendered dark + faded behind the cell content (see BentoCell). */
  image?: string
}

const CELLS: Cell[] = [
  {
    name: 'Alpha',
    kicker: 'The ML ranker',
    body: 'A machine-learning ranker that scores the whole NSE board by expected forward return: momentum, quality, mean-reversion. The top of the book feeds Signals, Momentum and AutoPilot.',
    icon: Layers,
    href: '/signals',
    span: 'lg:col-span-2 lg:row-span-2',
    signature: true,
    image: '/images/v3/ai-engines.webp',
  },
  {
    name: 'Regime',
    kicker: 'The gate',
    body: 'Reads the tape every day: bull, sideways or bear. Bear regime, and every other engine sizes risk down. Automatically.',
    icon: Gauge,
    href: '/proof?tab=regime',
    span: 'lg:col-span-2',
    image: '/images/v3/ai-regime.webp',
  },
  {
    name: 'Mood',
    kicker: 'The news read',
    body: 'Scores Indian financial news per ticker. Tuned on how the local market actually talks.',
    icon: Newspaper,
    href: '/stocks',
    span: 'lg:col-span-1',
    image: '/images/v3/ai-neural.webp',
  },
  {
    name: 'Counterpoint',
    kicker: 'The other side',
    body: 'Argues the bull and the bear case on every signal before it ships. You see what could go wrong.',
    icon: Scale,
    href: '/signals',
    span: 'lg:col-span-1',
    image: '/images/v3/ai-agents.webp',
  },
  {
    name: 'AutoPilot',
    kicker: 'Autonomous execution',
    body: 'Autonomously trades the top-ranked names on your own broker: Kelly sizing, daily rebalance, VIX overlay. Supervised. Hard stops stay authoritative.',
    icon: Crown,
    href: '/signals',
    span: 'lg:col-span-2',
    image: '/images/v3/ai-autopilot.webp',
  },
  {
    name: 'Copilot',
    kicker: 'The trading copilot',
    body: 'Ask anything about a stock, a signal or your book. Get real charts back, not chatbot fluff.',
    icon: MessageSquare,
    href: '/assistant',
    span: 'lg:col-span-2',
    ai: true,
    image: '/images/v3/ai-copilot.webp',
  },
  {
    name: 'AI Scanner',
    kicker: '50+ filters · 11 patterns',
    body: 'Sweep 1,800+ stocks for setups in real time. Breakout, momentum, OI, delivery surge. No match? Describe the setup, Copilot finds it.',
    icon: ScanSearch,
    href: '/scanner-lab',
    span: 'lg:col-span-2',
    image: '/images/v3/ai-scanner.webp',
  },
  {
    name: 'Portfolio Doctor',
    kicker: 'The risk check',
    body: 'Know where your book breaks before it does. A multi-agent pass over exposure, concentration and momentum on your holdings.',
    icon: Stethoscope,
    href: '/assistant',
    span: 'lg:col-span-2',
    image: '/images/v3/ai-risk.webp',
  },
]

export default function EnginesBento() {
  return (
    <section id="engines" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">The AI engine stack</p>
        <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
          Five engines. One{' '}
          <span className="text-gradient font-bold">gated signal.</span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-d-text-secondary">
          Every engine is named, machine-learning trained and gated. No black boxes. Every win,
          every loss, shows on the public{' '}
          <Link href="/proof?tab=track-record" className="text-d-text-primary underline-offset-4 hover:underline">
            track record
          </Link>
          .
        </p>
      </Reveal>

      <RevealGroup
        className="mt-10 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        amount={0.12}
      >
        {CELLS.map((c) => (
          <RevealItem key={c.name} as="article" className={c.span}>
            <BentoCell cell={c} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}

function BentoCell({ cell }: { cell: Cell }) {
  const { icon: Icon, signature, ai, image } = cell
  return (
    <Link
      href={cell.href}
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-colors lift',
        signature
          ? 'border-transparent ring-line'
          : 'border-line bg-wrap hover:bg-wrap-hover',
      ].join(' ')}
    >
      {/* On-brand decorative art (dark), a low-opacity backdrop on the right/
          bottom, faded into the card surface so the copy stays legible on BOTH
          themes (the art reads as a tasteful watermark, not a clashing block).
          Decorative (alt=""), below the fold → lazy. */}
      {image && (
        <>
          <Image
            src={image}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 540px, (min-width: 640px) 50vw, 100vw"
            className={[
              'object-cover transition-[opacity,transform] duration-500 will-change-transform group-hover:scale-[1.06]',
              signature ? 'opacity-40 group-hover:opacity-55' : 'opacity-30 group-hover:opacity-45',
            ].join(' ')}
          />
          {/* fade the render into the card surface from the left + bottom so the
              copy stays legible while the art stays vivid on the right. */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-wrap via-wrap/80 to-wrap/15" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-wrap to-transparent" />
        </>
      )}

      {/* Signature cell carries the ONE gradient as a low-opacity wash */}
      {signature && (
        <>
          <span aria-hidden className="bg-gradient-signature absolute inset-0 opacity-[0.08]" />
          <span aria-hidden className="absolute inset-0 ring-line rounded-2xl" />
          <span aria-hidden className="bg-signature-wash absolute inset-x-0 top-0 h-2/3" />
        </>
      )}

      {/* AI cell (Copilot) carries the violet AI accent, depth pool only,
          AI-ONLY. No data colors here. */}
      {ai && <span aria-hidden className="bg-radial-glow-ai absolute inset-x-0 top-0 h-2/3" />}

      <div className="relative flex items-start justify-between">
        <span
          className={[
            'flex h-9 w-9 items-center justify-center rounded-lg border',
            signature
              ? 'border-line bg-wrap/80 text-d-text-primary'
              : ai
                ? 'border-ai bg-main text-ai'
                : 'border-line bg-main text-d-text-secondary group-hover:text-d-text-primary',
          ].join(' ')}
        >
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-d-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="relative mt-4">
        <h3 className="heading-display text-[18px] font-semibold text-d-text-primary">{cell.name}</h3>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-d-text-muted">
          {cell.kicker}
        </p>
      </div>
      <p className="relative mt-3 text-[13px] leading-relaxed text-d-text-secondary">{cell.body}</p>
    </Link>
  )
}
