'use client'

/**
 * UseCasesV4 — landing blueprint item 7 (FintechX 07-usecases*.jpeg).
 *
 * Centered "Use cases" eyebrow pill + Bricolage H2 ("Who Quant X is
 * built for"), then four tall persona cards (Swing trader · F&O trader ·
 * Long-term investor · Busy professional) in the template's soft-gradient
 * card style — title top, slate body, huge display stat pinned to the
 * bottom edge. Below the cards, an NSE symbol ticker strip reusing
 * `.animate-marquee` (pauses on hover, static under reduced-motion).
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe.
 * Motion: whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1],
 * 60ms stagger), reduced-motion collapses to plain fade.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Briefcase,
  CandlestickChart,
  Clock,
  LineChart,
  type LucideIcon,
} from '@/lib/icons'

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

/* Soft light-mode card shadow (spec §3 recipe — neutral rgba, token-safe). */
const CARD_SHADOW =
  'shadow-card-float'

interface Persona {
  icon: LucideIcon
  title: string
  body: string
  stat: string
  statLabel: string
  /* Template's soft photo-blur gradients, rebuilt from token tints. */
  tint: string
}

const PERSONAS: Persona[] = [
  {
    icon: CandlestickChart,
    title: 'Swing traders',
    body: 'Ranked swing setups with an explainable thesis — entry, stop and target defined before you ever click.',
    stat: '100%',
    statLabel: 'of signals clear the backtest gate first',
    tint: 'bg-gradient-to-b from-wrap via-main to-primary/20',
  },
  {
    icon: LineChart,
    title: 'F&O traders',
    body: 'Option-chain analytics, volatility views and per-symbol hedge breakdowns — with Counterpoint arguing the other side.',
    stat: 'Live',
    statLabel: 'chain, Greeks and hedge views in one desk',
    tint: 'bg-gradient-to-b from-wrap via-main to-cyan/20',
  },
  {
    icon: Briefcase,
    title: 'Long-term investors',
    body: 'Ask the screener in plain English and get a ranked shortlist grounded in fundamentals — no formulas required.',
    stat: '2,385',
    statLabel: 'NSE stocks you can screen today',
    tint: 'bg-gradient-to-b from-wrap via-main to-warning/15',
  },
  {
    icon: Clock,
    title: 'Busy professionals',
    body: 'AutoPilot runs the routine on your own broker account. You review the plan and approve every trade.',
    stat: '1 tap',
    statLabel: 'kill-switch — always on, always yours',
    tint: 'bg-gradient-to-b from-wrap via-main to-ai/20',
  },
]

/* Symbol ticker — coverage strip, deliberately price-free (no implied P&L). */
const SYMBOLS: string[] = [
  'NIFTY 50',
  'RELIANCE',
  'HDFCBANK',
  'TCS',
  'BANKNIFTY',
  'INFY',
  'ICICIBANK',
  'SBIN',
  'LT',
  'ITC',
  'BAJFINANCE',
  'MARUTI',
  'SUNPHARMA',
  'TITAN',
  'AXISBANK',
  'BHARTIARTL',
]

function PersonaCard({ icon: Icon, title, body, stat, statLabel, tint }: Persona) {
  return (
    <div
      className={`flex h-full min-h-[22rem] flex-col rounded-3xl border border-line p-7 lg:min-h-[26rem] ${tint} ${CARD_SHADOW}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-wrap ${CARD_SHADOW}`}
      >
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} aria-hidden />
      </div>

      <h3 className="heading-display mt-5 text-2xl leading-tight text-d-text-primary">
        {title}
      </h3>
      <p className="mt-3 text-base font-medium leading-relaxed text-d-text-secondary">
        {body}
      </p>

      <div className="mt-auto pt-10">
        <div className="heading-display text-4xl text-d-text-primary md:text-5xl">
          {stat}
        </div>
        <p className="mt-2 text-sm font-medium text-d-text-secondary">
          {statLabel}
        </p>
      </div>
    </div>
  )
}

function SymbolChip({ label }: { label: string }) {
  return (
    /* Right margin instead of track gap keeps the -50% loop seamless. */
    <span
      className={`mr-3 inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-wrap px-5 py-2.5 ${CARD_SHADOW}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden />
      <span className="font-mono text-sm font-medium tracking-[0.04em] text-d-text-primary">
        {label}
      </span>
    </span>
  )
}

export function UseCasesV4() {
  const reduce = useReducedMotion()
  const item = reduce ? fadeVariants : riseVariants

  return (
    <section id="use-cases" className="overflow-hidden bg-wrap py-20 md:py-28">
      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div
        variants={groupVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-[1240px] px-6 text-center"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
        >
          Use cases
        </motion.span>

        <motion.h2
          variants={item}
          className="heading-display mx-auto mt-5 max-w-2xl text-4xl leading-[1.15] text-d-text-primary md:text-5xl md:leading-[1.15]"
        >
          Who Quant X is built for
        </motion.h2>
      </motion.div>

      {/* ── Persona cards ───────────────────────────────────────── */}
      <motion.div
        variants={groupVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto mt-12 grid max-w-[1240px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PERSONAS.map((persona) => (
          <motion.div key={persona.title} variants={item} className="h-full">
            <PersonaCard {...persona} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Symbol ticker strip ─────────────────────────────────── */}
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mt-16"
      >
        <p className="px-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-d-text-muted">
          Screen anything on NSE — heavyweights to the long tail
        </p>

        <div className="marquee-pause relative mt-5 overflow-hidden mask-edge-fade">
          <div
            className="flex w-max items-center whitespace-nowrap py-1 animate-marquee"
            style={{ ['--marquee-duration' as string]: '38s' }}
          >
            {SYMBOLS.map((symbol) => (
              <SymbolChip key={symbol} label={symbol} />
            ))}
            {/* Duplicate pass — purely visual, hidden from the a11y tree. */}
            <span aria-hidden className="contents">
              {SYMBOLS.map((symbol) => (
                <SymbolChip key={`dup-${symbol}`} label={symbol} />
              ))}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
