'use client'

/**
 * IntegrationsV4 — landing blueprint item 8 (FintechX 08-integrations*.jpeg).
 *
 * Broker & data integrations: centered eyebrow pill + Bricolage H2 + lead +
 * glossy-blue CTA, then a floating cluster of circular monogram tiles
 * (Zerodha / Upstox / Angel One / NSE / BSE / Watchlists — text monograms,
 * no fake logos) orbiting a dark Quant X hub, closing with a "growing"
 * line over a photographic band (`/v4/integrations-landscape.webp`,
 * token-gradient fallback when the asset is absent).
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe.
 * Motion: whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1],
 * 60ms stagger), reduced-motion collapses to plain fade.
 */

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight } from '@/lib/icons'

const EASE = [0.22, 1, 0.36, 1] as const

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const popVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

/* Soft light-mode card shadow (spec §3 recipe — neutral rgba, token-safe). */
const CARD_SHADOW =
  'shadow-card-float'

/* Photographic band — image if present, token gradient underneath as fallback. */
const BAND_BG =
  "url('/v4/integrations-landscape.webp'), linear-gradient(180deg, rgb(var(--rgb-cyan) / 0.14) 0%, rgb(var(--primary) / 0.10) 55%, rgb(var(--primary) / 0.26) 100%)"

interface IntegrationTile {
  monogram: string
  name: string
  caption: string
  /** Monogram ink — token text classes only. */
  tone: string
  /** Absolute placement on the md+ orbit canvas. */
  position: string
  /** Outer circle size (md+ orbit). */
  size: string
}

const TILES: IntegrationTile[] = [
  {
    monogram: 'Z',
    name: 'Zerodha',
    caption: 'Broker OAuth',
    tone: 'text-primary',
    position: 'left-[4%] top-[52%]',
    size: 'h-28 w-28',
  },
  {
    monogram: 'U',
    name: 'Upstox',
    caption: 'Broker OAuth',
    tone: 'text-cyan',
    position: 'left-[19%] top-[10%]',
    size: 'h-24 w-24',
  },
  {
    monogram: 'NSE',
    name: 'NSE',
    caption: 'EOD data',
    tone: 'text-d-text-primary',
    position: 'left-1/2 top-0 -translate-x-1/2',
    size: 'h-28 w-28',
  },
  {
    monogram: 'A',
    name: 'Angel One',
    caption: 'Broker OAuth',
    tone: 'text-primary',
    position: 'right-[19%] top-[12%]',
    size: 'h-24 w-24',
  },
  {
    monogram: 'BSE',
    name: 'BSE',
    caption: 'EOD data',
    tone: 'text-cyan',
    position: 'right-[4%] top-[54%]',
    size: 'h-28 w-28',
  },
  {
    monogram: 'W',
    name: 'Watchlists',
    caption: 'Synced live',
    tone: 'text-d-text-primary',
    position: 'left-[27%] top-[58%]',
    size: 'h-24 w-24',
  },
]

function TileCircle({
  tile,
  className = '',
}: {
  tile: IntegrationTile
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full bg-wrap text-center ${CARD_SHADOW} ${className}`}
    >
      <span
        className={`font-display text-xl font-semibold leading-none tracking-[-0.02em] ${tile.tone}`}
      >
        {tile.monogram}
      </span>
      <span className="mt-1.5 text-[11px] font-semibold leading-none text-d-text-primary">
        {tile.name}
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-d-text-muted">
        {tile.caption}
      </span>
    </div>
  )
}

function HubCircle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-d-text-primary ${CARD_SHADOW} ${className}`}
      aria-hidden
    >
      <span className="font-display text-4xl font-semibold tracking-[-0.02em] text-main">
        Q
      </span>
    </div>
  )
}

export function IntegrationsV4() {
  const reduce = useReducedMotion()
  const item = reduce ? fadeVariants : riseVariants
  const pop = reduce ? fadeVariants : popVariants

  return (
    <section id="integrations" className="scroll-mt-24 bg-wrap px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-main">
        {/* ── Intro: eyebrow + H2 + lead + CTA ─────────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 text-center md:pt-28"
        >
          <motion.span
            variants={item}
            className={`inline-flex items-center rounded-full bg-wrap px-4 py-1.5 text-sm font-semibold text-d-text-primary ${CARD_SHADOW}`}
          >
            Integrations
          </motion.span>

          <motion.h2
            variants={item}
            className="font-display mt-6 text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-d-text-primary"
          >
            Connects with the broker you already use
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-d-text-secondary md:text-xl"
          >
            Official OAuth for Zerodha, Upstox and Angel One, plus NSE &amp;
            BSE end-of-day data. Your funds and holdings never leave your own
            broker account.
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <Link
              href="/signup"
              className="cta-gloss group inline-flex items-center gap-3 rounded-full bg-gradient-cta py-2.5 pl-7 pr-2.5 text-lg font-semibold text-on-signature transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              Connect your broker
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Floating monogram cluster (md+: orbit around hub) ────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative mx-auto mt-14 hidden h-[380px] max-w-5xl md:block"
        >
          {TILES.map((tile) => (
            <motion.div
              key={tile.name}
              variants={pop}
              className={`absolute ${tile.position}`}
            >
              <TileCircle tile={tile} className={tile.size} />
            </motion.div>
          ))}
          <motion.div
            variants={pop}
            className="absolute left-1/2 top-[46%] -translate-x-1/2"
          >
            <HubCircle className="h-40 w-40" />
          </motion.div>
        </motion.div>

        {/* ── Mobile cluster: hub + wrapped tiles ───────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 flex flex-col items-center gap-6 px-6 md:hidden"
        >
          <motion.div variants={pop}>
            <HubCircle className="h-24 w-24" />
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TILES.map((tile) => (
              <motion.div key={tile.name} variants={pop}>
                <TileCircle tile={tile} className="h-24 w-24" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Closing line + photographic band ─────────────────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 md:mt-8"
        >
          <motion.h3
            variants={item}
            className="font-display mx-auto max-w-2xl text-balance px-6 text-center text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-d-text-primary md:text-4xl"
          >
            Every connection is official — and the list is growing
          </motion.h3>

          <motion.p
            variants={item}
            className="mt-3 px-6 text-center text-sm font-semibold uppercase tracking-[0.08em] text-d-text-muted"
          >
            3 brokers &middot; NSE &amp; BSE EOD data &middot; paper trading
            included
          </motion.p>

          <motion.div
            variants={reduce ? fadeVariants : riseVariants}
            aria-hidden
            className="mt-12 h-48 w-full bg-cover bg-center md:h-64"
            style={{ backgroundImage: BAND_BG }}
          />
        </motion.div>
      </div>
    </section>
  )
}
