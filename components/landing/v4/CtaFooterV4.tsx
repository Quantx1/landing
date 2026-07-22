'use client'

/**
 * CtaFooterV4 — landing blueprint item 13 (FintechX 13-footer.jpeg).
 *
 * Closing photographic band (template bookend: sky/nature backdrop via
 * .bg-hero-sky + optional /v4/hero-sky-alt.png, no-ops if missing) that
 * carries BOTH the big CTA band and the floating footer card:
 *
 *   · CTA band — eyebrow pill, Bricolage H2, lead, the EXACT measured
 *     glossy pill (SPECIMENS.md: .bg-gradient-cta + .cta-gloss, 47px tall,
 *     30px left pad, Inter 600 18 white label, trailing 28px white circle
 *     with blue arrow) + white secondary pill.
 *   · Footer — template "Night" variant per the blueprint: the near-black
 *     ink-token card (bg-d-text-primary, the sanctioned token for black
 *     surfaces — see ComparisonV4) floating over the photo, white ink,
 *     brand column + Product/Company/Legal columns, hairline divider,
 *     SEBI/educational disclaimer, © line and social chips.
 *
 * Token classes only (no raw hexes; recipes live in globals.css). Motion:
 * whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1], 60ms
 * stagger), opacity-only under reduced motion.
 */

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
  Twitter,
  Youtube,
} from '@/lib/icons'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const YEAR = new Date().getFullYear()

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  heading: string
  links: FooterLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Use cases', href: '#use-cases' },
      { label: 'Integrations', href: '#integrations' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Track record', href: '/proof' },
      { label: 'Markets', href: '/markets' },
      { label: 'Sign in', href: '/login' },
      { label: 'Start free', href: '/signup' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Security', href: '#security' },
      { label: 'FAQs', href: '#faqs' },
    ],
  },
]

const SOCIALS = [
  { label: 'Quant X on X', icon: Twitter, href: '#' },
  { label: 'Quant X on LinkedIn', icon: Linkedin, href: '#' },
  { label: 'Quant X on YouTube', icon: Youtube, href: '#' },
  { label: 'Quant X on Instagram', icon: Instagram, href: '#' },
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

export function CtaFooterV4() {
  const [bandOk, setBandOk] = useState(true)

  return (
    <section id="get-started" className="relative isolate overflow-hidden">
      {/* ── Closing photographic band (template bookend) ── */}
      <div className="absolute inset-0 -z-10 bg-hero-sky" aria-hidden>
        {bandOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/v4/hero-sky-alt.png"
            alt=""
            className="h-full w-full object-cover"
            onError={() => setBandOk(false)}
          />
        ) : null}
        {/* Soft CSS clouds keep the mood even without the photo */}
        <div className="absolute left-[10%] top-28 h-24 w-64 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[12%] top-16 h-28 w-80 rounded-full bg-white/40 blur-3xl" />
        {/* Blend down from the white FAQ section above */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-wrap to-transparent" />
      </div>

      {/* ── CTA band ── */}
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 text-center sm:px-6 md:pb-24 md:pt-36">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-wrap px-4 py-1.5 text-sm font-semibold text-d-text-secondary shadow-card-float">
            <Sparkles size={14} className="text-primary" aria-hidden />
            Get started
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-d-text-primary sm:text-5xl md:text-6xl">
            Start on paper. Go live when you&rsquo;re ready.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-d-text-secondary md:text-xl">
            Every engine is free on paper trading. Connect Zerodha, Upstox or
            Angel One when the desk earns your trust — you approve every trade.
          </p>
        </Reveal>

        <Reveal
          delay={0.18}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          {/* EXACT glossy pill recipe (SPECIMENS.md) */}
          <Link
            href="/signup"
            className="cta-gloss group inline-flex h-[47px] items-center gap-3 rounded-full bg-gradient-cta pl-[30px] pr-2.5 text-lg font-semibold text-on-signature transition-transform hover:-translate-y-0.5"
          >
            Start free
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wrap text-primary transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={15} aria-hidden />
            </span>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-[47px] items-center justify-center rounded-full border border-line bg-wrap px-[30px] text-lg font-semibold text-d-text-primary shadow-card-float transition-colors hover:bg-wrap-hover"
          >
            View pricing
          </Link>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-6 text-sm font-medium text-d-text-muted">
            ₹0 plan · Paper trading first · Kill-switch built in
          </p>
        </Reveal>
      </div>

      {/* ── Night footer card floating over the band ── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-6 sm:px-6 md:pb-10">
        <Reveal>
          <footer className="rounded-[30px] bg-d-text-primary px-6 py-10 text-white sm:px-10 md:px-14 md:py-14">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
              {/* Brand column */}
              <div>
                <Link href="/" className="inline-flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-signature">
                    <span className="font-display text-base font-bold text-on-signature">
                      Q
                    </span>
                  </span>
                  <span className="font-display text-xl font-semibold tracking-tight text-white">
                    Quant X
                  </span>
                </Link>
                <p className="mt-5 max-w-xs text-base leading-relaxed text-white/65">
                  An AI trading desk for NSE &amp; BSE — five engines,
                  explainable signals, every strategy backtest-gated.
                </p>
                <a
                  href="mailto:support@quantx.app"
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <Mail size={16} aria-hidden />
                  support@quantx.app
                </a>
              </div>

              {/* Link columns */}
              {FOOTER_COLUMNS.map((column) => (
                <nav
                  key={column.heading}
                  aria-label={`Footer — ${column.heading}`}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {column.heading}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-base text-white/65 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <div className="my-8 h-px bg-white/10 md:my-10" aria-hidden />

            {/* SEBI / educational disclaimer */}
            <p className="max-w-4xl text-sm leading-relaxed text-white/55">
              For research and education only. Quant X is not a SEBI-registered
              investment adviser or research analyst; signals, screeners and
              backtests are learning tools — not investment advice, and never a
              promise of returns. Investments in securities markets are subject
              to market risks; read all related documents carefully. AutoPilot
              runs on your own broker account, and every trade needs your
              approval.
            </p>

            <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="text-sm text-white/55" suppressHydrationWarning>
                © {YEAR} Quant X · All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
                  >
                    <social.icon size={16} aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </Reveal>
      </div>
    </section>
  )
}
