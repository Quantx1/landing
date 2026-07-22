'use client'

/**
 * StepsV4 — "How it works" (FintechX blueprint item 5, 05-steps.jpeg).
 *
 * Left: eyebrow pill · huge Bricolage display heading · lead · two stat
 * blocks. Right: step-switcher pills straddling a white rounded-3xl stage
 * card; the stage shows a glossy-blue center chip wired to two satellite
 * nodes with dashed connectors, a proof badge, and the step title + body.
 *
 * Token classes only (no raw hexes — shadows use the spec §1/§3 rgba
 * recipes). Icons from '@/lib/icons'. framer-motion whileInView reveals
 * per FINTECHX-SYSTEM §6; honors reduced motion.
 */

import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Bell,
  BrainCircuit,
  CheckCircle2,
  Database,
  Landmark,
  LineChart,
  Lock,
  Plug,
  Send,
  ShieldCheck,
} from '@/lib/icons'
import type { ComponentType } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* Spec §3 light-card shadow + §1 CTA glow recipes (rgba, not hex). */
const CARD_SHADOW =
  'shadow-card-float'
const CTA_GLOW =
  'shadow-cta-glow'

type IconType = ComponentType<{ className?: string }>

interface Step {
  label: string
  title: string
  body: string
  badge: string
  center: IconType
  left: IconType
  right: IconType
}

const STEPS: Step[] = [
  {
    label: 'Step 01',
    title: 'Connect your broker',
    body: 'Secure OAuth with Zerodha, Upstox or Angel One. We never see your password — and we never hold your funds.',
    badge: 'OAuth only · funds stay with your broker',
    center: Plug,
    left: Landmark,
    right: Lock,
  },
  {
    label: 'Step 02',
    title: 'AI screens & backtests',
    body: 'Alpha, Mood, Regime and Counterpoint scan NSE & BSE — and every idea must clear the backtest gate before it reaches you.',
    badge: '100% backtest-gated',
    center: BrainCircuit,
    left: Database,
    right: LineChart,
  },
  {
    label: 'Step 03',
    title: 'You approve every trade',
    body: 'Signals arrive with a full thesis. Nothing executes until you confirm — AutoPilot runs on your own broker account.',
    badge: 'Your call, always',
    center: CheckCircle2,
    left: Bell,
    right: Send,
  },
]

const STATS: { value: string; label: string }[] = [
  { value: '3', label: 'brokers — Zerodha, Upstox & Angel One via OAuth' },
  { value: '100%', label: 'of signals pass the backtest gate before you see them' },
]

function StageNode({ icon: Icon }: { icon: IconType }) {
  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-wrap sm:h-20 sm:w-20 ${CARD_SHADOW}`}
    >
      <Icon className="h-6 w-6 text-d-text-primary sm:h-7 sm:w-7" />
    </div>
  )
}

export function StepsV4() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const baseId = useId()
  const step = STEPS[active]

  const reveal = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    whileInView: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 } as const,
    transition: { duration: 0.5, delay, ease: EASE },
  })

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-main">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-32 lg:px-8">
        {/* ── Left: eyebrow · display heading · lead · stats ── */}
        <div>
          <motion.div {...reveal()}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-wrap px-4 py-1.5 text-sm font-semibold text-d-text-secondary">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
              How it works
            </span>
          </motion.div>

          <motion.h2
            {...reveal(0.06)}
            className="font-display mt-6 max-w-xl text-balance text-[clamp(2.4rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-d-text-primary"
          >
            Up and running in minutes
          </motion.h2>

          <motion.p
            {...reveal(0.12)}
            className="mt-5 max-w-md text-lg leading-relaxed text-d-text-secondary"
          >
            Connect your broker, let the engines screen and backtest the
            market, and approve every trade yourself.
          </motion.p>

          <motion.dl {...reveal(0.18)} className="mt-14 grid grid-cols-2 gap-10">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <dd className="font-display text-5xl font-semibold tracking-[-0.02em] text-d-text-primary">
                  {stat.value}
                </dd>
                <dt className="mt-3 max-w-[200px] text-[15px] leading-snug text-d-text-secondary">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ── Right: switcher pills straddling the stage card ── */}
        <motion.div {...reveal(0.1)}>
          <div
            role="tablist"
            aria-label="How it works steps"
            className="relative z-10 -mb-5 flex justify-center gap-2"
          >
            {STEPS.map((s, i) => {
              const selected = i === active
              return (
                <button
                  key={s.label}
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                    selected
                      ? `border border-line bg-wrap text-d-text-primary ${CARD_SHADOW}`
                      : 'border border-transparent bg-wrap/50 text-d-text-muted hover:text-d-text-secondary'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            className={`rounded-3xl border border-line bg-wrap px-6 pb-10 pt-14 sm:px-10 sm:pb-12 ${CARD_SHADOW}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex min-h-[320px] flex-col justify-center sm:min-h-[340px]"
              >
                {/* Node → chip → node wiring */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <StageNode icon={step.left} />
                  <div
                    aria-hidden
                    className="h-0 flex-1 border-t-2 border-dashed border-wrap-line"
                  />
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-gradient-cta sm:h-24 sm:w-24 sm:rounded-[28px] ${CTA_GLOW}`}
                  >
                    <step.center className="h-9 w-9 text-on-signature sm:h-10 sm:w-10" />
                  </div>
                  <div
                    aria-hidden
                    className="h-0 flex-1 border-t-2 border-dashed border-wrap-line"
                  />
                  <StageNode icon={step.right} />
                </div>

                {/* Proof badge */}
                <div className="mt-7 flex justify-center">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border border-line bg-wrap px-4 py-1.5 text-sm font-semibold text-d-text-primary ${CARD_SHADOW}`}
                  >
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {step.badge}
                  </span>
                </div>

                {/* Step copy */}
                <h3 className="font-display mt-8 text-center text-[26px] font-semibold tracking-[-0.02em] text-d-text-primary sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-center text-base leading-relaxed text-d-text-secondary">
                  {step.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
