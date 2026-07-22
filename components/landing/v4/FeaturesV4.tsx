'use client'

/**
 * FeaturesV4 — "Core features" section (FintechX v4, blueprint item 3).
 *
 * Template ref: scratchpad/fintechx/03-features*.jpeg — white band on the
 * blue-grey page, split header (eyebrow pill + 2-line Bricolage H2 left,
 * right-aligned lead + black pill CTA right), then three tall rounded-3xl
 * feature cards: a soft-grey card, a sky-tinted card and a near-black card,
 * each carrying a small token-built UI vignette.
 *
 * Token classes only (light-landing pins the light values); icons from
 * '@/lib/icons'; motion = whileInView fade/rise per spec §6.
 */

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Search, ShieldCheck, Sparkles } from '@/lib/icons'

// ── Motion (spec §6: 0.5s, ease [0.22,1,0.36,1], 60ms stagger) ──────────
const EASE = [0.22, 1, 0.36, 1] as const

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const riseReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// Template's light-mode card shadow (spec §3) — rgba only, no hex tokens.
const CARD_SHADOW =
  'shadow-card-float'

// ── Vignette data ────────────────────────────────────────────────────────
const SIGNAL_LEVELS: ReadonlyArray<readonly [string, string]> = [
  ['Entry', '₹2,842'],
  ['Target', '₹2,988'],
  ['Stop', '₹2,779'],
]

const SCREEN_ROWS = [
  { symbol: 'TATASTEEL', change: '+2.4%', d: 'M1 16L11 13L21 15L31 9L41 11L51 6L63 4' },
  { symbol: 'HDFCBANK', change: '+1.1%', d: 'M1 14L11 15L21 11L31 12L41 8L51 9L63 5' },
  { symbol: 'CIPLA', change: '+0.8%', d: 'M1 17L11 14L21 15L31 12L41 13L51 8L63 6' },
] as const

function Sparkline({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 20" className={className} fill="none" aria-hidden="true">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FeaturesV4() {
  const reduce = useReducedMotion()
  const item = reduce ? riseReduced : rise

  return (
    <section id="features" className="scroll-mt-24 bg-wrap py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Header: eyebrow + H2 left · lead + black pill CTA right ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span
              variants={item}
              className="inline-flex rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
            >
              Core features
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-5 font-display text-4xl font-semibold leading-[1.12] tracking-[-0.02em] text-d-text-primary sm:text-5xl"
            >
              Everything you need
              <br />
              before you place the trade
            </motion.h2>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:text-right">
            <motion.p
              variants={item}
              className="max-w-sm text-lg leading-relaxed text-d-text-secondary"
            >
              Professional tools for active traders on NSE &amp; BSE — every
              idea explained, every strategy backtested before it reaches you.
            </motion.p>
            <motion.div variants={item}>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 rounded-full bg-d-text-primary py-2 pl-6 pr-2 text-base font-semibold text-wrap transition-colors hover:bg-d-text-primary/90"
              >
                Explore the platform
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap/15 transition-transform duration-300 ease-xai-out group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Three feature cards ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {/* Card 1 — Signals with a thesis (soft grey) */}
          <motion.article
            variants={item}
            className={`flex flex-col rounded-3xl bg-main p-7 sm:p-8 ${CARD_SHADOW}`}
          >
            <h3 className="text-center font-display text-2xl font-semibold tracking-[-0.01em] text-d-text-primary sm:text-[1.75rem] sm:leading-9">
              Signals with a thesis
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-d-text-secondary">
              Every signal ships with its reasoning — entry, target, stop and
              the why, in plain words.
            </p>

            <div className="mt-8 flex flex-1 items-center">
              <div className={`w-full rounded-2xl border border-line bg-wrap p-5 ${CARD_SHADOW}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold tracking-wide text-d-text-primary">
                      RELIANCE
                    </p>
                    <p className="mt-0.5 text-xs text-d-text-muted">
                      NSE · Swing · 2–10 days
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Long setup
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {SIGNAL_LEVELS.map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-main px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-d-text-muted">
                        {label}
                      </p>
                      <p className="mt-0.5 font-mono text-sm text-d-text-primary">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2.5 border-t border-line pt-4">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-d-text-secondary">
                    Alpha and Regime agree — range breakout on rising delivery
                    volume. Cleared the backtest gate.
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Backtest-gated
                </span>
              </div>
            </div>
          </motion.article>

          {/* Card 2 — NL screener (sky tint) */}
          <motion.article
            variants={item}
            className={`flex flex-col rounded-3xl bg-gradient-to-b from-cyan/20 via-primary/10 to-main p-7 sm:p-8 ${CARD_SHADOW}`}
          >
            <h3 className="text-center font-display text-2xl font-semibold tracking-[-0.01em] text-d-text-primary sm:text-[1.75rem] sm:leading-9">
              Screen in plain English
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-d-text-secondary">
              Describe the setup you want — it becomes precise filters across
              2,300+ NSE stocks.
            </p>

            <div className="mt-8 flex flex-1 items-center">
              <div className={`w-full rounded-2xl border border-line bg-wrap p-4 ${CARD_SHADOW}`}>
                <div className="flex items-center gap-2.5 rounded-full border border-line bg-main px-4 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-d-text-muted" aria-hidden="true" />
                  <span className="truncate text-sm text-d-text-secondary">
                    rsi below 30, above 200-dma, midcap
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-d-text-muted">
                    12 matches
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
                    Live
                  </span>
                </div>

                <ul className="mt-2">
                  {SCREEN_ROWS.map((row) => (
                    <li
                      key={row.symbol}
                      className="flex items-center justify-between gap-3 border-t border-line py-2.5"
                    >
                      <span className="font-mono text-sm text-d-text-primary">
                        {row.symbol}
                      </span>
                      <Sparkline d={row.d} className="h-5 w-16 text-primary" />
                      <span className="rounded-full bg-up/10 px-2 py-0.5 font-mono text-xs text-up">
                        {row.change}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>

          {/* Card 3 — Options & F&O copilot (near-black, giant verdict) */}
          <motion.article
            variants={item}
            className="flex flex-col rounded-3xl bg-d-text-primary p-7 text-center sm:p-8"
          >
            <h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-wrap sm:text-[1.75rem] sm:leading-9">
              Options &amp; F&amp;O copilot
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-wrap/70">
              Chain, Greeks and volatility context, read together — drafted
              into a structure you approve.
            </p>

            <div className="flex flex-1 flex-col items-center justify-center py-10">
              <span className="rounded-full border border-wrap/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-wrap/70">
                Copilot read
              </span>
              <div className="relative mt-3 select-none" aria-hidden="true">
                <span className="block bg-gradient-to-b from-wrap to-wrap/40 bg-clip-text font-display text-6xl font-bold leading-none tracking-[-0.02em] text-transparent sm:text-7xl">
                  HEDGE
                </span>
                {/* Reflection */}
                <span className="absolute left-0 top-full block w-full -scale-y-100 bg-gradient-to-b from-wrap to-wrap/40 bg-clip-text font-display text-6xl font-bold leading-none tracking-[-0.02em] text-transparent opacity-20 [mask-image:linear-gradient(to_bottom,transparent_45%,black_95%)] sm:text-7xl">
                  HEDGE
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-wrap/50">
              Paper-trade every structure before it goes anywhere near your
              broker.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
