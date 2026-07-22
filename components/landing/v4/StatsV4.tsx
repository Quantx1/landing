'use client'

/**
 * StatsV4 — landing blueprint item 9 (FintechX 09-stats*.jpeg).
 *
 * Big honest numbers: centered "Platform stats" pill + Bricolage H2 +
 * slate lead, then staggered stat cards in the template's four surface
 * treatments — dark ink card, glossy blue card (with circular icon
 * chip), tinted card, white hairline card. Numbers are real: 2,385 NSE
 * stocks · 100% backtest-gated · 5 engines · 810+ automated tests.
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe
 * (ink/main channel pairs invert together in dark mode). Motion:
 * whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1], 60ms
 * stagger); reduced-motion collapses to plain fade. Stagger offsets use
 * margin (not translate) so framer-motion keeps ownership of transform.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { FlaskConical, type LucideIcon } from '@/lib/icons'

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

/* Glossy CTA glow (spec §1 recipe) driven by the primary token. */
const CTA_GLOW =
  'shadow-cta-glow'

type StatTone = 'ink' | 'blue' | 'tinted' | 'outline'

interface Stat {
  tone: StatTone
  label: string
  value: string
  description: string
  icon?: LucideIcon
  /* Template stagger — top offset applied ≥ xl via margin (not transform). */
  offsetClass: string
}

const STATS: Stat[] = [
  {
    tone: 'ink',
    label: 'Market coverage',
    value: '2,385',
    description: 'NSE stocks in the live universe, refreshed with daily EOD data.',
    offsetClass: 'xl:mt-0',
  },
  {
    tone: 'blue',
    label: 'Backtest gate',
    value: '100%',
    description: 'Every strategy clears an out-of-sample backtest before it can go live.',
    icon: FlaskConical,
    offsetClass: 'xl:mt-12',
  },
  {
    tone: 'tinted',
    label: 'AI engines',
    value: '5',
    description: 'Alpha, Mood, Regime, AutoPilot and Counterpoint — one coordinated desk.',
    offsetClass: 'xl:mt-4',
  },
  {
    tone: 'outline',
    label: 'Automated tests',
    value: '810+',
    description: 'The suite runs green before any release reaches your account.',
    offsetClass: 'xl:mt-16',
  },
]

/* Surface + ink recipes per tone. Ink card uses the ink/main channel pair
   so it stays high-contrast if the theme ever flips; blue card wears the
   signature gradient with white ink (constant in both modes). */
const TONE_CARD: Record<StatTone, string> = {
  ink: `bg-d-text-primary ${CARD_SHADOW}`,
  blue: `bg-gradient-cta ${CTA_GLOW}`,
  tinted: 'bg-main',
  outline: `bg-wrap border border-line ${CARD_SHADOW}`,
}

const TONE_LABEL: Record<StatTone, string> = {
  ink: 'text-main/70',
  blue: 'text-on-signature',
  tinted: 'text-d-text-secondary',
  outline: 'text-d-text-secondary',
}

const TONE_VALUE: Record<StatTone, string> = {
  ink: 'text-main',
  blue: 'text-on-signature',
  tinted: 'text-d-text-primary',
  outline: 'text-d-text-primary',
}

const TONE_DESC: Record<StatTone, string> = {
  ink: 'text-main/70',
  blue: 'text-on-signature opacity-80',
  tinted: 'text-d-text-secondary',
  outline: 'text-d-text-secondary',
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon
  return (
    <div
      className={`flex min-h-[320px] flex-col rounded-3xl p-7 md:p-8 ${TONE_CARD[stat.tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`max-w-[9rem] text-base font-semibold leading-snug ${TONE_LABEL[stat.tone]}`}
        >
          {stat.label}
        </span>
        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-d-text-primary text-main">
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="mt-auto pt-10">
        <div
          className={`heading-display text-6xl leading-none tracking-[-0.02em] md:text-7xl ${TONE_VALUE[stat.tone]}`}
        >
          {stat.value}
        </div>
        <p
          className={`mt-4 max-w-[15rem] text-base font-medium leading-snug ${TONE_DESC[stat.tone]}`}
        >
          {stat.description}
        </p>
      </div>
    </div>
  )
}

export function StatsV4() {
  const reduce = useReducedMotion()
  const item = reduce ? fadeVariants : riseVariants

  return (
    <section id="stats" className="bg-wrap py-20 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        {/* ── Header: pill badge + display H2 + lead ─────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
          >
            Platform stats
          </motion.span>

          <motion.h2
            variants={item}
            className="heading-display mt-6 text-4xl leading-[1.1] text-d-text-primary md:text-6xl md:leading-[1.1]"
          >
            The numbers behind the desk
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-d-text-secondary md:text-xl"
          >
            Live market coverage, five AI engines and an automated test wall
            — measured honestly, with nothing inflated.
          </motion.p>
        </motion.div>

        {/* ── Staggered stat cards (template's floating rhythm) ──── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:mt-20 xl:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className={stat.offsetClass}
            >
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
