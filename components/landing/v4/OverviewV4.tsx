'use client'

/**
 * OverviewV4 — "Platform overview" command-center band (FintechX §5.4).
 *
 * Template-true: photographic/sky band, centered pill badge + Bricolage H2,
 * glossy-blue + ink pill CTAs, a large floating product frame
 * (`/v4/app-markets.png`, graceful HTML-mock fallback) and 4 mini overview
 * cards (Portfolio · AI Copilot · Scanner · AutoPilot).
 *
 * Token classes only (no raw hexes — rgba shadow recipes come verbatim from
 * docs/FINTECHX-SYSTEM.md §1/§3). Icons via '@/lib/icons'. Light-pinned by
 * the page root's `.light-landing`; every class stays theme-correct anyway.
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Bell,
  Bot,
  Briefcase,
  CandlestickChart,
  Gauge,
  LayoutDashboard,
  PieChart,
  Radar,
  Rocket,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from '@/lib/icons'

/* ── Motion vocabulary (spec §6: 0.5s, ease [0.22,1,0.36,1], 60ms stagger) ── */

const EASE = [0.22, 1, 0.36, 1] as const

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

const VIEWPORT = { once: true, amount: 0.2 } as const

/* ── Shadow recipes (spec §1/§3 — rgba, never hex, template-glossy) ── */

const CARD_SHADOW =
  'shadow-card-float'
const FRAME_SHADOW =
  'shadow-[0_2px_4px_rgba(29,29,29,0.05),0_32px_80px_-32px_rgba(29,29,29,0.28)]'

/* ── Static content (hoisted — never rebuilt per render) ── */

interface NavItem {
  icon: LucideIcon
  label: string
  active?: boolean
}

const MOCK_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CandlestickChart, label: 'Markets', active: true },
  { icon: Zap, label: 'Signals' },
  { icon: Radar, label: 'Scanner' },
  { icon: Bot, label: 'AI Copilot' },
  { icon: Rocket, label: 'AutoPilot' },
]

const MOCK_STATS: Array<{
  icon: LucideIcon
  label: string
  value: string
  delta: string
  up: boolean
}> = [
  { icon: Gauge, label: 'Market mood', value: 'Bullish 64%', delta: '+0.8%', up: true },
  { icon: PieChart, label: 'Top sector today', value: 'Financials', delta: '+1.4%', up: true },
  { icon: Activity, label: 'India VIX', value: '13.24', delta: '-2.1%', up: false },
]

const MOCK_TRENDING: Array<{
  mono: string
  symbol: string
  price: string
  delta: string
  up: boolean
  points: string
}> = [
  {
    mono: 'RE',
    symbol: 'RELIANCE',
    price: '2,981.40',
    delta: '+1.2%',
    up: true,
    points: '0,22 12,20 24,21 36,16 48,17 60,12 72,10 84,8 96,5',
  },
  {
    mono: 'HD',
    symbol: 'HDFCBANK',
    price: '1,642.10',
    delta: '+0.4%',
    up: true,
    points: '0,18 12,19 24,15 36,17 48,14 60,15 72,12 84,13 96,10',
  },
  {
    mono: 'TC',
    symbol: 'TCS',
    price: '4,210.55',
    delta: '-0.6%',
    up: false,
    points: '0,8 12,10 24,9 36,13 48,12 60,16 72,15 84,19 96,21',
  },
  {
    mono: 'IN',
    symbol: 'INFY',
    price: '1,558.25',
    delta: '+2.1%',
    up: true,
    points: '0,24 12,21 24,22 36,18 48,15 60,16 72,11 84,9 96,4',
  },
]

const MOCK_SCANS: Array<{
  symbol: string
  setup: string
  confidence: string
  bias: string
}> = [
  { symbol: 'TATAPOWER', setup: 'Trend reversal', confidence: '82%', bias: 'Bullish' },
  { symbol: 'ICICIBANK', setup: 'Breakout retest', confidence: '76%', bias: 'Bullish' },
]

const OVERVIEW_CARDS: Array<{
  icon: LucideIcon
  lead: string
  body: string
}> = [
  {
    icon: Briefcase,
    lead: 'Portfolio, in focus:',
    body: 'holdings, paper trades and live P&L from your own broker account, in one clear view.',
  },
  {
    icon: Bot,
    lead: 'AI Copilot on call:',
    body: 'ask in plain English and get the reasoning behind every signal, screen and risk flag.',
  },
  {
    icon: Radar,
    lead: 'Scanner on watch:',
    body: 'sweep 2,300+ NSE stocks with natural-language screens and pattern setups.',
  },
  {
    icon: Zap,
    lead: 'AutoPilot, supervised:',
    body: 'backtest-gated orders on your own broker account — approve, pause or stop any time.',
  },
]

/* ── Sparkline (pure, module-level) ── */

function Sparkline({ points, className }: { points: string; className?: string }) {
  return (
    <svg viewBox="0 0 96 28" fill="none" aria-hidden="true" className={className}>
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── HTML fallback for the product frame (token-only markets mock) ── */

function MarketsMock() {
  return (
    <div className="bg-main text-left">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-line bg-wrap px-4 py-3 sm:px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-signature">
          <Sparkles className="h-3.5 w-3.5 text-on-signature" aria-hidden="true" />
        </span>
        <span className="font-display text-sm font-semibold text-d-text-primary">Quant X</span>
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
        <span className="hidden text-sm font-medium text-d-text-secondary sm:block">Markets</span>
        <div className="ml-auto hidden w-56 items-center gap-2 rounded-full border border-line bg-main px-3 py-1.5 md:flex">
          <Search className="h-3.5 w-3.5 text-d-text-muted" aria-hidden="true" />
          <span className="text-xs text-d-text-muted">Search stocks, screens…</span>
        </div>
        <span className="relative ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-line bg-wrap md:ml-0">
          <Bell className="h-3.5 w-3.5 text-d-text-secondary" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        </span>
        <span className="h-7 w-7 rounded-full bg-gradient-signature ring-2 ring-wrap" aria-hidden="true" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-line bg-wrap p-3 lg:flex">
          {MOCK_NAV.map((item) => (
            <span
              key={item.label}
              className={
                item.active
                  ? 'flex items-center gap-2.5 rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary'
                  : 'flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-medium text-d-text-secondary'
              }
            >
              <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </span>
          ))}
          <div className="mt-4 rounded-xl border border-line bg-main p-3">
            <p className="text-[11px] font-medium leading-snug text-d-text-secondary">
              Unlock every engine with <span className="font-semibold text-d-text-primary">Pro</span>
            </p>
            <span className="mt-2 inline-flex rounded-full bg-d-text-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
              Upgrade
            </span>
          </div>
        </div>

        {/* Main pane */}
        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          {/* Stat cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {MOCK_STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-wrap p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  <span
                    className={
                      stat.up
                        ? 'font-mono text-xs font-medium text-up'
                        : 'font-mono text-xs font-medium text-down'
                    }
                  >
                    {stat.delta}
                  </span>
                </div>
                <p className="mt-3 text-xs text-d-text-muted">{stat.label}</p>
                <p className="mt-0.5 font-display text-lg font-semibold text-d-text-primary">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Trending row */}
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-d-text-primary">Trending on NSE</p>
              <span className="text-xs font-semibold text-primary">View all markets</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {MOCK_TRENDING.map((row) => (
                <div key={row.symbol} className="rounded-xl border border-line bg-wrap p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-main text-[10px] font-semibold text-d-text-secondary">
                      {row.mono}
                    </span>
                    <span className="truncate text-xs font-semibold text-d-text-primary">
                      {row.symbol}
                    </span>
                    <span
                      className={
                        row.up
                          ? 'ml-auto font-mono text-[10px] font-medium text-up'
                          : 'ml-auto font-mono text-[10px] font-medium text-down'
                      }
                    >
                      {row.delta}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-sm font-medium text-d-text-primary">
                    ₹{row.price}
                  </p>
                  <Sparkline
                    points={row.points}
                    className={row.up ? 'mt-1 h-6 w-full text-up' : 'mt-1 h-6 w-full text-down'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Opportunity scanner */}
          <div className="rounded-xl border border-line bg-wrap p-4">
            <p className="text-sm font-semibold text-d-text-primary">Opportunity scanner</p>
            <p className="mt-0.5 text-xs text-d-text-muted">
              AI-found setups, backtest-gated before they reach you
            </p>
            <div className="mt-3 overflow-hidden">
              <div className="grid grid-cols-4 gap-2 border-b border-line pb-2 text-[10px] font-semibold uppercase tracking-wide text-d-text-muted sm:grid-cols-5">
                <span>Symbol</span>
                <span>Setup</span>
                <span>Confidence</span>
                <span className="hidden sm:block">Bias</span>
                <span className="text-right">Action</span>
              </div>
              {MOCK_SCANS.map((scan) => (
                <div
                  key={scan.symbol}
                  className="grid grid-cols-4 items-center gap-2 border-b border-line py-2.5 text-xs last:border-0 sm:grid-cols-5"
                >
                  <span className="font-mono font-medium text-d-text-primary">{scan.symbol}</span>
                  <span className="text-d-text-secondary">{scan.setup}</span>
                  <span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                      {scan.confidence}
                    </span>
                  </span>
                  <span className="hidden font-medium text-d-text-primary sm:block">{scan.bias}</span>
                  <span className="text-right font-semibold text-primary">Review</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Section ── */

export function OverviewV4() {
  const reduce = useReducedMotion()
  const [skyOk, setSkyOk] = useState(true)
  const [frameOk, setFrameOk] = useState(true)

  const item = reduce ? fadeVariants : riseVariants

  return (
    <section id="overview" className="relative overflow-hidden bg-main">
      {/* Photographic band — sky photo if shipped, token-gradient fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-cyan/20 via-primary/5 to-main"
      />
      {skyOk ? (
        <Image
          src="/v4/overview-band.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-80"
          onError={() => setSkyOk(false)}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-main"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        {/* Header */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item}>
            <span
              className={`inline-flex items-center rounded-full border border-line bg-wrap px-5 py-2 text-sm font-semibold text-d-text-secondary ${CARD_SHADOW}`}
            >
              Platform overview
            </span>
          </motion.div>

          <motion.h2
            variants={item}
            className="mt-6 font-display text-4xl font-semibold tracking-tight text-d-text-primary sm:text-5xl [text-wrap:balance]"
          >
            One command center for your whole book
          </motion.h2>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-d-text-secondary sm:text-xl"
          >
            Watchlists, signals, portfolio and risk in a single live workspace — five engines
            reporting to one desk, with the reasoning always a click away.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="cta-gloss group inline-flex items-center gap-3 rounded-full bg-gradient-cta py-2.5 pl-7 pr-2.5 text-base font-semibold text-on-signature ring-4 ring-wrap/60 transition-transform duration-200 hover:-translate-y-0.5 sm:text-lg"
            >
              Explore the platform
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/proof?tab=track-record"
              className="inline-flex items-center rounded-full bg-d-text-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 sm:text-lg"
            >
              See it live
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating product frame */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.985 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`mx-auto mt-16 max-w-6xl rounded-[24px] border border-line bg-wrap p-2 sm:mt-20 sm:rounded-[32px] sm:p-3 ${FRAME_SHADOW}`}
        >
          <div className="overflow-hidden rounded-2xl border border-line">
            {frameOk ? (
              <Image
                src="/v4/app-markets.png"
                alt="Quant X markets workspace — market mood, trending NSE stocks and the AI opportunity scanner in one view"
                width={1600}
                height={1000}
                className="block h-auto w-full"
                onError={() => setFrameOk(false)}
              />
            ) : (
              <MarketsMock />
            )}
          </div>
        </motion.div>

        {/* 4 mini overview cards */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mx-auto mt-6 grid max-w-6xl gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {OVERVIEW_CARDS.map((card) => (
            <motion.div
              key={card.lead}
              variants={item}
              className={`rounded-2xl border border-line bg-wrap p-6 ${CARD_SHADOW}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-d-text-primary">
                <card.icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </span>
              <p className="mt-4 text-base leading-relaxed text-d-text-secondary">
                <span className="font-semibold text-d-text-primary">{card.lead}</span>{' '}
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
