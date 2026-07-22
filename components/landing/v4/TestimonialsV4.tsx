'use client'

/**
 * TestimonialsV4 — landing blueprint item 10 (FintechX 10-tail-a.jpeg).
 *
 * Photographic band (next/image `/v4/testimonial-band.png`, cover;
 * token-gradient sky fallback when the asset is absent) with a
 * left-aligned Bricolage H2 + trust row, a dark pill CTA on the right,
 * then a testimonial ticker of WHITE rounded-[30px] cards (40px pad,
 * w≈400 — SPECIMENS.md measured values; flat, no border/shadow).
 * Section rhythm 200px 0 at desktop.
 *
 * Personas are placeholder Indian trader archetypes (clearly generic
 * names, disclaimer below the ticker) — SEBI-safe copy, no return
 * promises, no fabricated ratings, public engine names only.
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe.
 * Motion: whileInView fade/rise per spec §6; the marquee collapses to a
 * plain scrollable row under reduced-motion.
 */

import { Fragment, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  ArrowRight,
  MessageSquare,
  Star,
  Users,
  type LucideIcon,
} from '@/lib/icons'

const EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = { once: true, amount: 0.2 } as const

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

/* Soft light-mode shadow (spec §3 recipe) — CTA pill only; the white
   testimonial cards are FLAT per SPECIMENS.md. */
const SOFT_SHADOW =
  'shadow-card-float'

const MARQUEE_STYLE = { '--marquee-duration': '55s' } as CSSProperties

/* ── Data ─────────────────────────────────────────────────────────── */

interface TrustItem {
  icon: LucideIcon
  tint: string
  label: string
}

/* Honest trust markers — never a fabricated star-rating or user count. */
const TRUST_ROW: TrustItem[] = [
  { icon: Star, tint: 'text-warning [&_path]:fill-current', label: 'Early-access traders' },
  { icon: Users, tint: 'text-primary', label: 'India-wide community' },
  { icon: MessageSquare, tint: 'text-cyan', label: 'Feedback-driven roadmap' },
]

interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
  tint: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Every signal ships with a thesis and a backtest. I finally understand why I am taking a trade before I take it.',
    name: 'Arjun M.',
    role: 'Swing trader · Bengaluru',
    initials: 'AM',
    tint: 'bg-primary/10 text-primary',
  },
  {
    quote:
      'I type the setup I want in plain English and the screener hands back a shortlist with reasons — not a wall of filters.',
    name: 'Priya S.',
    role: 'F&O trader · Mumbai',
    initials: 'PS',
    tint: 'bg-cyan/10 text-cyan',
  },
  {
    quote:
      'AutoPilot runs on my own broker account and I approve every order. That control is the reason I stayed.',
    name: 'Rohan K.',
    role: 'Working professional · Pune',
    initials: 'RK',
    tint: 'bg-primary/10 text-primary',
  },
  {
    quote:
      'Paper trading first meant I could test the engines without risking a rupee. The discipline carried over.',
    name: 'Kavya R.',
    role: 'Long-term investor · Chennai',
    initials: 'KR',
    tint: 'bg-cyan/10 text-cyan',
  },
  {
    quote:
      'Counterpoint argues the bear case against my own idea. It has talked me out of more weak trades than any indicator.',
    name: 'Vikram D.',
    role: 'Positional trader · Hyderabad',
    initials: 'VD',
    tint: 'bg-primary/10 text-primary',
  },
  {
    quote:
      'The kill-switch and the clean risk view make it feel like a proper trading desk, not a tips channel.',
    name: 'Meera N.',
    role: 'Swing trader · Delhi',
    initials: 'MN',
    tint: 'bg-cyan/10 text-cyan',
  },
]

/* ── Static pieces (hoisted — rendering-hoist-jsx) ────────────────── */

/* Decorative opening quote — replaces the template's 5-star row (a star
   rating on illustrative personas would be a fabricated stat). */
const QUOTE_MARK = (
  <span
    aria-hidden="true"
    className="block font-display text-5xl font-semibold leading-none text-primary/30"
  >
    &ldquo;
  </span>
)

/* Testimonial card — SPECIMENS.md: WHITE, radius 30px, pad 40px, w≈400,
   flat (sits directly on the photographic band). */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex min-h-[22rem] w-[320px] shrink-0 flex-col justify-between gap-10 rounded-[30px] bg-wrap p-8 sm:w-[400px] sm:p-10">
      <div>
        {QUOTE_MARK}
        <blockquote className="mt-4 text-lg font-medium leading-[1.4] text-d-text-primary">
          {t.quote}
        </blockquote>
      </div>
      <figcaption className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${t.tint}`}
        >
          {t.initials}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-display text-xl font-semibold leading-snug text-d-text-primary">
            {t.name}
          </span>
          <span className="text-base font-medium text-d-text-muted">
            {t.role}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

function TickerGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex gap-6 pr-6">
      {TESTIMONIALS.map((t) => (
        <TestimonialCard key={t.name} t={t} />
      ))}
    </div>
  )
}

/* ── Section ──────────────────────────────────────────────────────── */

export function TestimonialsV4() {
  const reduce = useReducedMotion()
  const [bandOk, setBandOk] = useState(true)

  const item = reduce ? fadeVariants : riseVariants

  return (
    <section id="testimonials" className="relative overflow-hidden bg-wrap">
      {/* Photographic band — sky→meadow photo, token-gradient fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-wrap via-cyan/15 to-primary/10"
      />
      {bandOk ? (
        <Image
          src="/v4/testimonial-band.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
          onError={() => setBandOk(false)}
        />
      ) : null}
      {/* Seams into the white neighbour sections (Stats above, Pricing below) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-wrap to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-wrap to-transparent"
      />

      {/* SPECIMENS.md rhythm: testimonial band = 200px 0 at 1440w */}
      <div className="relative py-28 md:py-[200px]">
        {/* Header: H2 + trust row left, dark pill CTA right */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-x-12 gap-y-10 px-6"
        >
          <div className="max-w-2xl">
            <motion.h2
              variants={item}
              className="heading-display text-4xl leading-[1.2] text-d-text-primary md:text-[48px] md:leading-[1.2]"
            >
              What early traders say about the platform
            </motion.h2>

            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              {TRUST_ROW.map((trust, i) => (
                <Fragment key={trust.label}>
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="hidden h-5 w-px bg-wrap-line sm:block"
                    />
                  ) : null}
                  <span className="flex items-center gap-2">
                    <trust.icon
                      className={`h-5 w-5 ${trust.tint}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span className="text-base font-semibold text-d-text-primary">
                      {trust.label}
                    </span>
                  </span>
                </Fragment>
              ))}
            </motion.div>
          </div>

          {/* Dark pill CTA with white halo ring (template treatment) */}
          <motion.div variants={item}>
            <span className="inline-flex rounded-full bg-wrap/60 p-1.5">
              <Link
                href="/signup"
                className={`group inline-flex items-center gap-3 rounded-full bg-d-text-primary py-2.5 pl-7 pr-2.5 text-lg font-semibold text-main transition-all duration-200 hover:opacity-90 active:scale-[0.99] ${SOFT_SHADOW}`}
              >
                Get started today
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap text-d-text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
              </Link>
            </span>
          </motion.div>
        </motion.div>

        {/* Testimonial ticker */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 sm:mt-20"
        >
          {reduce ? (
            <div className="flex gap-6 overflow-x-auto px-6 pb-2">
              <TickerGroup />
            </div>
          ) : (
            <div className="marquee-pause overflow-hidden">
              <div className="flex w-max animate-marquee" style={MARQUEE_STYLE}>
                <TickerGroup />
                <TickerGroup ariaHidden />
              </div>
            </div>
          )}
        </motion.div>

        {/* Honesty line — placeholder personas, no endorsements */}
        <p className="relative mx-auto mt-12 max-w-3xl px-6 text-center text-sm font-medium text-d-text-muted">
          Illustrative early-access personas, not client endorsements. Quant X
          is an analysis and execution tool — markets carry risk and outcomes
          vary.
        </p>
      </div>
    </section>
  )
}
