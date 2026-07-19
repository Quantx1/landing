'use client'

/**
 * Hero, v2.1 "premium feature-sell".
 *
 * Asymmetric split: a multi-weight Plus Jakarta headline with the ONE
 * signature gradient on the key phrase (left) + dual CTAs + a live trust
 * row; and on the right a PREMIUM PRODUCT MOCKUP, our real signal UI framed
 * in a mac-style window (BrowserFrame) over the on-brand hero banner, with a
 * live engine-pipeline Terminal and a live Nifty artifact floating on top.
 *
 * The framed mockup is a product render (our real signal UI with representative
 * values) while the floating Nifty + regime chips read LIVE from the same unauth
 * public endpoints the rest of the page uses (indices · regimeHistory). That mix
 *, populated product render + a couple of genuinely live chips, is the honest
 * way to look premium without a backend. No fabricated returns anywhere (SEBI).
 *
 * Brand firewall: copy names the five public engines only (Alpha · Mood ·
 * Regime · AutoPilot · Counterpoint), never model architectures.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Sparkles } from '@/lib/icons'

import { api } from '@/lib/api'
import { DotPattern } from '@/components/ui/dot-pattern'
import { Terminal, AnimatedSpan, TypingAnimation } from '@/components/ui/terminal'
import { BrowserFrame } from './mockups/BrowserFrame'
import { SignalMockup } from './mockups/Mockups'

type RegimeName = 'bull' | 'sideways' | 'bear'

const REGIME_TONE: Record<RegimeName, string> = {
  bull: 'var(--color-up)',
  sideways: 'var(--color-warning)',
  bear: 'var(--color-down)',
}

export default function Hero() {
  const [nifty, setNifty] = useState<{ last: number | null; pct: number | null } | null>(null)
  const [regime, setRegime] = useState<{ name: RegimeName; conf: number } | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [idx, reg] = await Promise.all([
        api.publicTrust.indices().catch(() => null),
        api.publicTrust.regimeHistory(7).catch(() => null),
      ])
      if (!active) return

      const n = idx?.indices?.find((r) => r.key === 'nifty')
      if (n) setNifty({ last: n.last, pct: n.change_pct })

      const cur = (reg as any)?.current
      if (cur?.regime) {
        const name = String(cur.regime).toLowerCase() as RegimeName
        if (['bull', 'sideways', 'bear'].includes(name)) {
          const confKey = `prob_${name}` as 'prob_bull' | 'prob_sideways' | 'prob_bear'
          setRegime({ name, conf: Number(cur[confKey] || 0) })
        }
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const niftyUp = (nifty?.pct ?? 0) >= 0

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop: clean near-black canvas with a single radial depth glow +
          faint dot field, no atmospheric raster: the product render carries the
          visual weight while the canvas stays calm. */}
      <div aria-hidden className="bg-radial-glow absolute inset-x-0 top-0 -z-10 h-[560px]" />
      <DotPattern
        aria-hidden
        className="[mask-image:radial-gradient(60%_50%_at_50%_28%,#000_0%,transparent_75%)] -z-10 text-d-text-muted/40"
        width={26}
        height={26}
        cr={0.9}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-8 lg:pb-32 lg:pt-40">
        {/* ── Left: copy ── */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-pill border border-line bg-wrap/70 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-up" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-d-text-secondary">
              AI trading agents · live on the NSE
            </span>
          </div>

          <h1 className="heading-display mt-6 max-w-2xl text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[1.04]">
            <span className="font-medium text-d-text-primary">The AI trading desk</span>{' '}
            <span className="text-gradient font-bold">built for India.</span>{' '}
            <span className="font-medium text-d-text-primary">Five engines. One gated signal.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-d-text-secondary">
            Machine-learning engines rank every NSE stock. AI agents argue both sides.
            AutoPilot can run the book on your own broker. Every call scored, gated and
            explained in plain English. Paper-trade the whole stack free, no card needed.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="bg-gradient-cta group inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[14.5px] font-semibold text-on-signature transition-transform active:scale-[0.97]"
            >
              Start free
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
            <Link
              href="/proof?tab=track-record"
              className="inline-flex items-center gap-2 rounded-pill border border-line bg-wrap/40 px-5 py-3 text-[14px] font-medium text-d-text-primary backdrop-blur-sm transition-colors hover:bg-hover"
            >
              See the track record
              <ArrowUpRight className="h-4 w-4 text-d-text-muted" />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-d-text-muted">
            <span>Free to paper-trade</span>
            <span className="h-3 w-px bg-line" />
            <span>No card required</span>
            <span className="h-3 w-px bg-line" />
            <span>Connect Zerodha, Upstox, Angel One</span>
          </div>
        </div>

        {/* ── Right: framed product mockup + live overlays ── */}
        <div className="relative lg:pl-4">
          {/* AI-only depth pool behind the panel (violet, subtle) */}
          <div aria-hidden className="bg-radial-glow-ai absolute -inset-8 -z-10" />

          {/* The product mockup, our real signal UI, framed as a product render. */}
          <BrowserFrame url="quantx.app/signals">
            <SignalMockup />
          </BrowserFrame>

          {/* Live engine-pipeline trace, floats top-left, overlapping the frame */}
          <div className="absolute -left-3 -top-5 z-10 hidden w-[260px] sm:block lg:-left-8">
            <div className="absolute -top-2.5 left-3 z-10 inline-flex items-center gap-1.5 rounded-pill border border-line bg-wrap px-2.5 py-1 text-ai">
              <Sparkles className="h-3 w-3" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Engines · live</span>
            </div>
            <Terminal className="max-h-none w-full text-[11px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]">
              <TypingAnimation duration={28} className="text-d-text-muted">
                &gt; quantx scan --nse500
              </TypingAnimation>
              <AnimatedSpan delay={900} className="text-d-text-secondary">
                <span className="text-up">Alpha</span> ranked 500 names
              </AnimatedSpan>
              <AnimatedSpan delay={1300} className="text-d-text-secondary">
                <span className="text-up">Regime</span> gate: {regime ? regime.name : 'reading'}{' '}
                {regime ? `${Math.round(regime.conf * 100)}%` : ''}
              </AnimatedSpan>
              <AnimatedSpan delay={1700} className="text-d-text-secondary">
                <span className="text-up">Mood</span> news tape · pass
              </AnimatedSpan>
              <AnimatedSpan delay={2100} className="text-d-text-primary">
                <span className="text-ai">✓</span> signal cleared
              </AnimatedSpan>
            </Terminal>
          </div>

          {/* Live Nifty artifact, floats bottom-right, real public data */}
          <div className="absolute -bottom-6 -right-2 z-10 w-[58%] max-w-[250px] rounded-xl border border-line bg-wrap p-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] sm:-right-6 lg:-right-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-d-text-muted">Nifty 50 · live</span>
              {regime && (
                <span
                  className="rounded-pill px-2 py-0.5 text-[10px] font-medium capitalize"
                  style={{
                    color: REGIME_TONE[regime.name],
                    background: `color-mix(in srgb, ${REGIME_TONE[regime.name]} 12%, transparent)`,
                  }}
                >
                  {regime.name}
                </span>
              )}
            </div>
            <p className="numeric mt-1 text-[22px] font-semibold text-d-text-primary">
              {nifty?.last != null
                ? nifty.last.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '--'}
              {nifty?.pct != null && (
                <span className={`numeric ml-2 text-[12px] font-medium ${niftyUp ? 'text-up' : 'text-down'}`}>
                  {niftyUp ? '+' : ''}
                  {nifty.pct.toFixed(2)}%
                </span>
              )}
            </p>
            <p className="mt-1 text-[10.5px] text-d-text-muted">Live NSE index · refreshing now</p>
          </div>
        </div>
      </div>
    </section>
  )
}
