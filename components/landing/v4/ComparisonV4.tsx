'use client'

/**
 * ComparisonV4 — "Trading alone vs with Quant X" (FintechX blueprint item 2,
 * 02-comparison*.jpeg).
 *
 * Template-true before/after switcher: centered Bricolage H2, a floating
 * white pill with the two mode labels flanking a circular dial knob, and a
 * large rounded-3xl card beneath that crossfades between the muted "Trading
 * alone" state (X-list + down-tinted stat tiles) and the glossy-blue
 * "With Quant X" state (check-list + white-tinted tiles on the signature
 * gradient, white ink per spec §1).
 *
 * Token classes only (no raw hexes — shadows use the spec §1/§3 rgba
 * recipes). Icons from '@/lib/icons'. framer-motion whileInView reveals per
 * FINTECHX-SYSTEM §6; honors reduced motion. SEBI-safe copy: process claims
 * only, no return promises, public engine names only.
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Sparkles, X } from '@/lib/icons'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* Spec §3 light-card shadow + §1 CTA glow recipes (rgba, not hex). */
const CARD_SHADOW =
  'shadow-card-float'
const CTA_GLOW =
  'shadow-cta-glow'
const BLUE_CARD_SHADOW = 'shadow-[0_24px_60px_-24px_rgba(58,119,229,0.55)]'

type Mode = 'alone' | 'quantx'

interface Pane {
  heading: string
  points: string[]
  stats: { value: string; label: string }[]
}

const PANES: Record<Mode, Pane> = {
  alone: {
    heading: 'The grind of trading alone',
    points: [
      'Hours scanning charts after work — and still missing the setup',
      'Entries on tips and gut feel, with no backtest behind them',
      'No plan for the exit when the market turns against you',
      'Position sizes picked on vibes instead of defined risk',
    ],
    stats: [
      { value: '2,385', label: 'NSE stocks — far too many to scan by hand' },
      { value: '0', label: 'backtests behind a gut-feel entry' },
    ],
  },
  quantx: {
    heading: 'A clearer way to run your trades',
    points: [
      'Alpha surfaces setups with an explainable thesis — never a hunch',
      'Every signal must clear the backtest gate before it reaches you',
      'Mood and Regime read sentiment and market state for context',
      'AutoPilot runs on your own broker account — you approve every trade',
    ],
    stats: [
      { value: '5', label: 'AI engines behind every signal' },
      { value: '100%', label: 'of signals backtest-gated' },
    ],
  },
}

export function ComparisonV4() {
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<Mode>('alone')
  const touched = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  /* One-time story beat: flip to the "after" state a moment after the card
     scrolls into view — cancelled forever the instant the user interacts. */
  const armAutoFlip = () => {
    if (touched.current || timer.current) return
    timer.current = setTimeout(() => {
      if (!touched.current) setMode('quantx')
    }, 2600)
  }

  const pick = (next: Mode) => {
    touched.current = true
    setMode(next)
  }

  const isQuantx = mode === 'quantx'
  const pane = PANES[mode]

  return (
    <section id="comparison" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl text-center font-display text-4xl font-semibold tracking-[-1px] text-d-text-primary sm:text-5xl"
        >
          Smarter decisions
          <br className="hidden sm:block" /> start with clear data
        </motion.h2>

        {/* ── Switcher + card ─────────────────────────────────────── */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          onViewportEnter={armAutoFlip}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mx-auto mt-12 max-w-4xl sm:mt-16"
        >
          {/* Floating pill: label · dial knob · label */}
          <div className="relative z-10 flex justify-center">
            <div
              className={cn(
                'flex items-center gap-4 rounded-full border border-line bg-wrap px-5 sm:gap-8 sm:px-8',
                CARD_SHADOW
              )}
            >
              <button
                type="button"
                aria-pressed={!isQuantx}
                onClick={() => pick('alone')}
                className={cn(
                  'py-4 text-base font-semibold transition-colors sm:text-lg',
                  !isQuantx
                    ? 'text-d-text-primary'
                    : 'text-d-text-muted hover:text-d-text-secondary'
                )}
              >
                Trading alone
              </button>

              {/* Dial knob — ink face ⇄ glossy-blue face, notch swings */}
              <button
                type="button"
                aria-label={
                  isQuantx
                    ? 'Show trading alone'
                    : 'Show trading with Quant X'
                }
                onClick={() => pick(isQuantx ? 'alone' : 'quantx')}
                className={cn(
                  '-my-4 relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-wrap transition-shadow duration-500 sm:-my-5 sm:h-20 sm:w-20',
                  isQuantx ? CTA_GLOW : CARD_SHADOW
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 rounded-full bg-d-text-primary transition-opacity duration-500',
                    isQuantx && 'opacity-0'
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 rounded-full bg-gradient-signature transition-opacity duration-500',
                    !isQuantx && 'opacity-0'
                  )}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0"
                  animate={{ rotate: isQuantx ? 42 : -42 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 260, damping: 20 }
                  }
                >
                  <span className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-white/90" />
                </motion.span>
                <span className="absolute inset-0 grid place-items-center">
                  <Sparkles
                    className={cn(
                      'h-6 w-6 text-white transition-opacity duration-500 sm:h-7 sm:w-7',
                      !isQuantx && 'opacity-30'
                    )}
                  />
                </span>
              </button>

              <button
                type="button"
                aria-pressed={isQuantx}
                onClick={() => pick('quantx')}
                className={cn(
                  'py-4 text-base font-semibold transition-colors sm:text-lg',
                  isQuantx
                    ? 'text-primary'
                    : 'text-d-text-muted hover:text-d-text-secondary'
                )}
              >
                With Quant X
              </button>
            </div>
          </div>

          {/* Before/after card */}
          <div
            className={cn(
              'relative -mt-8 overflow-hidden rounded-3xl border transition-[border-color,box-shadow] duration-500',
              isQuantx
                ? cn('border-transparent', BLUE_CARD_SHADOW)
                : cn('border-line', CARD_SHADOW)
            )}
          >
            {/* Crossfading faces (solid white ⇄ signature gradient) */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 bg-wrap transition-opacity duration-500',
                isQuantx && 'opacity-0'
              )}
            />
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 bg-gradient-signature transition-opacity duration-500',
                !isQuantx && 'opacity-0'
              )}
            />
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,255,255,0.14),transparent)] transition-opacity duration-500',
                !isQuantx && 'opacity-0'
              )}
            />

            <div aria-live="polite" className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="grid gap-10 p-8 pt-16 sm:p-12 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
                >
                  {/* Left: heading + list */}
                  <div>
                    <h3
                      className={cn(
                        'max-w-md font-display text-3xl font-semibold tracking-[-1px] sm:text-4xl',
                        isQuantx
                          ? 'text-on-signature'
                          : 'text-d-text-primary'
                      )}
                    >
                      {pane.heading}
                    </h3>
                    <ul className="mt-8 space-y-5">
                      {pane.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span
                            className={cn(
                              'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full',
                              isQuantx
                                ? 'bg-white/15 text-white'
                                : 'bg-down/10 text-down'
                            )}
                          >
                            {isQuantx ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </span>
                          <span
                            className={cn(
                              'text-base font-medium leading-snug sm:text-lg',
                              isQuantx
                                ? 'text-white/85'
                                : 'text-d-text-secondary'
                            )}
                          >
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: stat tiles */}
                  <div className="grid content-start gap-4 sm:gap-5">
                    {pane.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className={cn(
                          'rounded-2xl border p-6 sm:p-7',
                          isQuantx
                            ? 'border-white/20 bg-white/10'
                            : 'border-down/20 bg-down/10'
                        )}
                      >
                        <div
                          className={cn(
                            'font-display text-4xl font-semibold tracking-[-1px] sm:text-5xl',
                            isQuantx
                              ? 'text-on-signature'
                              : 'text-d-text-primary'
                          )}
                        >
                          {stat.value}
                        </div>
                        <div
                          className={cn(
                            'mt-2 text-sm font-medium leading-snug sm:text-base',
                            isQuantx
                              ? 'text-white/75'
                              : 'text-d-text-muted'
                          )}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
