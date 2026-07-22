'use client'

/**
 * HeroV4 — FintechX-template hero (spec: docs/FINTECHX-SYSTEM.md §5 item 1).
 *
 * Sky backdrop (token gradient + /v4/hero-sky.png via next/image fill with a
 * slow 30s parallax drift — .animate-sky-drift, reduced-motion safe), floating
 * pill navbar (fixed — this component owns the landing nav), XL Bricolage
 * headline with the inline glossy /v4/ai-chip.png, glossy-blue CTA (.cta-gloss)
 * + white secondary, trust row, and a floating dashboard frame
 * (/v4/app-dashboard.png with a token-built HTML mock fallback). Light-pinned
 * page (`.light-landing`) — token classes only, no raw hexes (recipes live in
 * globals.css: .bg-hero-sky, .cta-gloss, .shadow-card-float).
 */

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  Briefcase,
  Gauge,
  PieChart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from '@/lib/icons'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '#faqs' },
]

/* ── Local reveal primitive (spec §6: fade/rise 0.5s, 60ms stagger) ── */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── Floating pill navbar (01-hero.jpeg recipe, spec §4) ── */

function NavbarV4() {
  const reduce = useReducedMotion()
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <motion.nav
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 rounded-full border border-line bg-wrap py-2 pl-3 pr-2 shadow-card-float"
        aria-label="Primary"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5 pl-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-signature">
            <span className="font-display text-[15px] font-bold text-on-signature">
              Q
            </span>
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-d-text-primary">
            Quant X
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-base font-semibold text-d-text-secondary transition-colors hover:bg-wrap-hover hover:text-d-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Black pill CTA with circular arrow chip (template-exact) */}
        <Link
          href="/signup"
          className="group flex shrink-0 items-center gap-2.5 rounded-full bg-d-text-primary py-2 pl-5 pr-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Try it free
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
      </motion.nav>
    </header>
  )
}

/* ── Dashboard mock (token-built fallback for /v4/app-dashboard.png) ── */

const STATS = [
  {
    label: 'Paper portfolio',
    value: '₹5,24,180',
    icon: PieChart,
    chip: 'bg-primary/10 text-primary',
    tone: 'text-d-text-primary',
  },
  {
    label: "Today's P&L",
    value: '+₹4,120',
    icon: TrendingUp,
    chip: 'bg-up/10 text-up',
    tone: 'text-up',
  },
  {
    label: 'Open positions',
    value: '6',
    icon: Briefcase,
    chip: 'bg-cyan/10 text-cyan',
    tone: 'text-d-text-primary',
  },
  {
    label: 'Risk score',
    value: 'Low · 24',
    icon: Gauge,
    chip: 'bg-warning/10 text-warning',
    tone: 'text-d-text-primary',
  },
]

const ALLOCATION = [
  { label: 'Equity', pct: '62%', swatch: 'bg-primary', ring: 'text-primary', dash: '62 38', offset: 25 },
  { label: 'F&O', pct: '23%', swatch: 'bg-warning', ring: 'text-warning', dash: '23 77', offset: 63 },
  { label: 'Cash', pct: '15%', swatch: 'bg-d-text-muted', ring: 'text-d-text-muted', dash: '15 85', offset: 40 },
]

function DashboardMock() {
  return (
    <div className="bg-wrap text-left" aria-label="Quant X dashboard preview">
      {/* App top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-signature">
            <span className="font-display text-[11px] font-bold text-on-signature">
              Q
            </span>
          </span>
          <span className="text-sm font-semibold text-d-text-primary">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-line bg-wrap-hover px-3 py-1.5 text-xs text-d-text-muted sm:flex">
            <Search size={14} aria-hidden />
            Search NSE stocks…
          </span>
          <Bell size={16} className="text-d-text-muted" aria-hidden />
          <span className="h-7 w-7 rounded-full bg-gradient-signature" aria-hidden />
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Greeting row */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-d-text-primary">
              Your trading desk
            </p>
            <p className="text-xs text-d-text-muted">
              Paper account · every signal backtest-gated
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Demo data
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line bg-wrap p-4"
            >
              <span
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${s.chip}`}
              >
                <s.icon size={16} aria-hidden />
              </span>
              <p className="text-xs font-medium text-d-text-muted">{s.label}</p>
              <p className={`font-mono text-lg font-semibold ${s.tone}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + allocation */}
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-wrap p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-d-text-primary">
                  Equity curve
                </p>
                <p className="text-xs text-d-text-muted">Paper account · 6 months</p>
              </div>
              <div className="hidden gap-1 sm:flex">
                {['Daily', 'Weekly', 'Monthly'].map((t) => (
                  <span
                    key={t}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      t === 'Monthly'
                        ? 'bg-primary/10 text-primary'
                        : 'text-d-text-muted'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <svg
              viewBox="0 0 400 130"
              preserveAspectRatio="none"
              className="h-36 w-full text-primary"
              role="img"
              aria-label="Illustrative portfolio equity curve"
            >
              <g className="text-line" stroke="currentColor" strokeWidth="1">
                <line x1="0" y1="32" x2="400" y2="32" />
                <line x1="0" y1="64" x2="400" y2="64" />
                <line x1="0" y1="96" x2="400" y2="96" />
              </g>
              <path
                d="M0 106 C28 96 46 100 70 84 C96 66 112 88 140 74 C170 58 186 44 216 54 C246 64 262 34 292 40 C322 46 344 24 400 30 L400 130 L0 130 Z"
                fill="currentColor"
                fillOpacity="0.08"
                stroke="none"
              />
              <path
                d="M0 106 C28 96 46 100 70 84 C96 66 112 88 140 74 C170 58 186 44 216 54 C246 64 262 34 292 40 C322 46 344 24 400 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-d-text-muted">
              {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-wrap p-4">
            <p className="mb-3 text-sm font-semibold text-d-text-primary">
              Allocation
            </p>
            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 100 100"
                className="h-24 w-24 shrink-0 -rotate-90"
                role="img"
                aria-label="Illustrative allocation split"
              >
                {ALLOCATION.map((a) => (
                  <circle
                    key={a.label}
                    cx="50"
                    cy="50"
                    r="40"
                    pathLength={100}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={a.dash}
                    strokeDashoffset={a.offset}
                    className={a.ring}
                  />
                ))}
              </svg>
              <div className="w-full space-y-2">
                {ALLOCATION.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="flex items-center gap-2 text-d-text-secondary">
                      <span
                        className={`h-2 w-2 rounded-full ${a.swatch}`}
                        aria-hidden
                      />
                      {a.label}
                    </span>
                    <span className="font-mono font-semibold text-d-text-primary">
                      {a.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-wrap-hover px-3 py-2 text-[11px] leading-snug text-d-text-muted">
              AutoPilot runs on your own broker account — you approve every
              trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Hero section ── */

const TRUST_ITEMS = [
  { icon: Star, tint: 'text-warning', label: 'Free paper trading' },
  { icon: ShieldCheck, tint: 'text-up', label: 'SEBI-aware design' },
  { icon: Zap, tint: 'text-primary', label: 'Backtest-gated signals' },
]

export function HeroV4() {
  const [skyOk, setSkyOk] = useState(true)
  const [chipOk, setChipOk] = useState(true)
  const [shotOk, setShotOk] = useState(true)

  return (
    <>
      <NavbarV4 />

      <section className="relative isolate overflow-hidden pb-20 pt-36 md:pt-44">
        {/* Sky backdrop: token gradient + optional photographic layer */}
        <div className="absolute inset-0 -z-10 bg-hero-sky" aria-hidden>
          {skyOk && (
            <Image
              src="/v4/hero-sky.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="animate-sky-drift object-cover"
              onError={() => setSkyOk(false)}
            />
          )}
          {/* Soft CSS clouds (render even without the photo) */}
          <div className="absolute left-[8%] top-24 h-24 w-64 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute right-[10%] top-40 h-28 w-80 rounded-full bg-white/50 blur-3xl" />
          <div className="absolute left-[38%] top-72 h-20 w-56 rounded-full bg-white/40 blur-3xl" />
          {/* Blend into the page surface below */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-main" />
        </div>

        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <h1 className="mx-auto max-w-5xl text-balance font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.015em] text-d-text-primary sm:text-6xl md:text-7xl lg:text-8xl">
              The AI trading{' '}
              <span
                className={`relative mx-[0.06em] inline-flex h-[0.92em] w-[0.92em] translate-y-[0.14em] items-center justify-center overflow-hidden rounded-[0.24em] align-baseline ${
                  chipOk ? '' : 'bg-gradient-signature shadow-cta-glow'
                }`}
                aria-hidden
              >
                {chipOk ? (
                  <Image
                    src="/v4/ai-chip.png"
                    alt=""
                    fill
                    priority
                    sizes="112px"
                    className="object-cover"
                    onError={() => setChipOk(false)}
                  />
                ) : (
                  <Sparkles className="h-[52%] w-[52%] text-on-signature" />
                )}
              </span>{' '}
              desk for India
            </h1>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-d-text-secondary md:text-xl">
              Five AI engines — Alpha, Mood, Regime, AutoPilot and Counterpoint
              — screen NSE &amp; BSE stocks, backtest every idea, and explain
              the thesis before you act.
            </p>
          </Reveal>

          <Reveal
            delay={0.12}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="cta-gloss group inline-flex items-center gap-3 rounded-full bg-gradient-cta py-2.5 pl-7 pr-2.5 text-lg font-semibold text-on-signature transition-transform hover:-translate-y-0.5"
            >
              Start free
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap text-primary transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={16} aria-hidden />
              </span>
            </Link>
            <Link
              href="/proof"
              className="inline-flex items-center justify-center rounded-full border border-line bg-wrap px-7 py-3.5 text-lg font-semibold text-d-text-primary shadow-card-float transition-colors hover:bg-wrap-hover"
            >
              View live demo
            </Link>
          </Reveal>

          <Reveal
            delay={0.18}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
          >
            {TRUST_ITEMS.map((item, i) => (
              <span key={item.label} className="flex items-center gap-4">
                {i > 0 && (
                  <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
                )}
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-d-text-secondary md:text-base">
                  <item.icon size={16} className={item.tint} aria-hidden />
                  {item.label}
                </span>
              </span>
            ))}
          </Reveal>

          {/* Floating dashboard frame */}
          <Reveal delay={0.24} className="relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-3xl border border-line bg-wrap shadow-card-float">
              {shotOk ? (
                <Image
                  src="/v4/app-dashboard.png"
                  alt="Quant X dashboard — signals, portfolio and AI copilot"
                  width={1600}
                  height={1000}
                  className="block h-auto w-full"
                  onError={() => setShotOk(false)}
                />
              ) : (
                <DashboardMock />
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
