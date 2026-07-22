'use client'

/**
 * SecurityV4 — landing blueprint item 6 (FintechX 06-security.jpeg).
 *
 * Trust band: left = diagram panel (shield chip → dashed connectors →
 * three circular trust badges), right = eyebrow pill + Bricolage H2 +
 * glossy-blue CTA + 4-item checklist (broker-OAuth only / kill-switch /
 * encrypted keys / backtest gate).
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe.
 * Motion: whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1],
 * 60ms stagger), reduced-motion collapses to plain fade.
 */

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  Landmark,
  Lock,
  Power,
  ShieldCheck,
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

/* Glossy CTA glow (spec §1 recipe) driven by the primary token. */
const CTA_GLOW =
  'shadow-cta-glow'

interface TrustBadge {
  icon: LucideIcon
  title: string
  caption: string
}

const BADGES: TrustBadge[] = [
  { icon: Landmark, title: 'OAuth 2.0', caption: 'Broker login' },
  { icon: Lock, title: 'Encrypted', caption: 'Broker keys' },
  { icon: Power, title: 'Kill-switch', caption: 'One tap' },
]

const CHECKLIST: string[] = [
  'Broker OAuth only — we never hold your funds',
  'One-tap kill-switch halts everything instantly',
  'Broker keys encrypted at rest, revocable anytime',
  'Every strategy clears a backtest gate before it runs',
]

function BadgeCircle({ icon: Icon, title, caption }: TrustBadge) {
  return (
    <div className="flex justify-center">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full bg-wrap sm:h-32 sm:w-32 ${CARD_SHADOW}`}
      >
        <div className="flex h-[5.5rem] w-[5.5rem] flex-col items-center justify-center gap-1 rounded-full border border-line sm:h-[6.5rem] sm:w-[6.5rem]">
          <Icon className="h-5 w-5 text-d-text-primary" aria-hidden />
          <span className="text-[13px] font-bold leading-none text-d-text-primary">
            {title}
          </span>
          <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-d-text-muted">
            {caption}
          </span>
        </div>
      </div>
    </div>
  )
}

export function SecurityV4() {
  const reduce = useReducedMotion()
  const item = reduce ? fadeVariants : riseVariants

  return (
    <section id="security" className="bg-wrap py-20 md:py-28">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        {/* ── Left: diagram panel ─────────────────────────────────── */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-3xl bg-main px-6 py-12 sm:px-10 md:py-16"
        >
          <div aria-hidden className="select-none">
            {/* Shield chip */}
            <div className="flex justify-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-cta text-on-signature ${CTA_GLOW}`}
              >
                <ShieldCheck className="h-9 w-9" strokeWidth={1.5} />
              </div>
            </div>

            {/* Connector: chip → hub */}
            <div className="mx-auto h-9 w-px border-l border-dashed border-wrap-line" />

            {/* Quant X hub node */}
            <div className="flex justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-wrap ${CARD_SHADOW}`}
              >
                <span className="heading-display text-xl font-bold text-d-text-primary">
                  Q
                </span>
              </div>
            </div>

            {/* Connector: hub → branch line */}
            <div className="mx-auto h-9 w-px border-l border-dashed border-wrap-line" />

            {/* Branch: horizontal rail + three drops */}
            <div className="relative">
              <div className="absolute left-[16.66%] right-[16.66%] top-0 border-t border-dashed border-wrap-line" />
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {BADGES.map((badge) => (
                  <div key={badge.title} className="flex flex-col items-center">
                    <div className="h-8 w-px border-l border-dashed border-wrap-line" />
                    <BadgeCircle {...badge} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right: copy + CTA + checklist ───────────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.span
            variants={item}
            className="inline-flex items-center rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
          >
            Security &amp; control
          </motion.span>

          <motion.h2
            variants={item}
            className="heading-display mt-5 text-4xl leading-[1.15] text-d-text-primary md:text-5xl md:leading-[1.15]"
          >
            Your money stays with your broker. Always.
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 max-w-md text-lg font-medium leading-relaxed text-d-text-secondary"
          >
            Quant X connects through official broker OAuth — funds stay in
            your account, and control stays with you. Every safeguard below
            ships on by default.
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <Link
              href="/signup"
              className="cta-gloss group inline-flex items-center gap-3 rounded-full bg-gradient-cta py-2.5 pl-7 pr-2.5 text-lg font-semibold text-on-signature transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              Start free
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
            </Link>
          </motion.div>

          <motion.ul variants={item} className="mt-10 space-y-4">
            {CHECKLIST.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className="text-base font-medium text-d-text-primary md:text-lg">
                  {line}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
