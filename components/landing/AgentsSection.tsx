'use client'

/**
 * AgentsSection, the AI narrative of the landing: a copilot you talk to, a team
 * of agents that argue every call, and a supervised executor that can run the
 * book. Distinct layout family from the zigzag FeatureSections and the bento:
 * a featured product render (left) beside a stacked agent list (right), then a
 * full-width "kept honest" gate strip.
 *
 * Premium on-brand renders (near-black canvas, emerald + violet accents) sit in
 * .dark-media frames so they read as deliberate dark product art on BOTH themes.
 *
 * Honest + brand firewall:
 *   • AutoPilot is SUPERVISED, hard stops stay authoritative; nothing trades
 *     live until it survives out-of-sample testing. No fabricated returns (SEBI).
 *   • Public engine / capability names only (Alpha · Mood · Regime · Counterpoint
 *     · AutoPilot · Copilot), never model architectures.
 */

import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare, Scale, Crown, ShieldCheck, ArrowUpRight } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

import { Reveal } from './_reveal'

interface AgentItem {
  icon: LucideIcon
  title: string
  body: string
  ai?: boolean
}

const AGENTS: AgentItem[] = [
  {
    icon: MessageSquare,
    title: 'A trading copilot you talk to',
    body: 'Ask in plain English. The copilot reads the same live ML engines and market data the rest of the app runs on, then streams real charts back inline. Grounded answers, not canned chatbot replies.',
    ai: true,
  },
  {
    icon: Scale,
    title: 'Specialist agents that argue both sides',
    body: 'A multi-agent stack works every call: Alpha ranks the board, Mood reads the news tape, Counterpoint argues the bear case. Every signal ships with the argument against it, not just the pitch.',
    ai: true,
  },
  {
    icon: Crown,
    title: 'Autonomous execution, on your terms',
    body: 'Hand the book to AutoPilot on your own broker: Kelly-sized, regime-aware, rebalanced every day. You approve the mandate, it runs hands-free, and your hard stops always stay authoritative.',
  },
]

export default function AgentsSection() {
  return (
    <section id="ai" className="scroll-mt-24 border-y border-line bg-wrap/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ai">
            Trading copilot · AI agents · autonomous execution
          </p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.08] text-d-text-primary">
            A copilot, a team of agents, and{' '}
            <span className="text-gradient font-bold">execution that runs itself.</span>
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-d-text-secondary">
            Not a chatbot bolted onto charts. A working AI trading desk: machine-learning engines
            do the analysis, specialist agents argue every call, and autonomous execution runs the
            book when you decide it has earned the seat.
          </p>
        </Reveal>

        {/* Featured render (left) + stacked agent list (right) */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <Reveal className="relative">
            <div aria-hidden className="bg-radial-glow-ai absolute -inset-8 -z-10" />
            <div className="dark-media relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)]">
              <Image
                src="/images/v3/ai-robot.webp"
                alt="An AI trading assistant analysing a live market chart"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="space-y-3">
              {AGENTS.map((a) => (
                <li
                  key={a.title}
                  className="group flex gap-4 rounded-2xl border border-line bg-wrap p-5 transition-colors hover:bg-wrap-hover"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      a.ai ? 'border-ai bg-main text-ai' : 'border-line bg-main text-d-text-primary'
                    }`}
                  >
                    <a.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="heading-display text-[17px] font-semibold text-d-text-primary">{a.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-d-text-secondary">{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/assistant"
                className="bg-gradient-cta group inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-[13.5px] font-semibold text-on-signature transition-transform active:scale-[0.97]"
              >
                Talk to Copilot
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signals"
                className="inline-flex items-center gap-2 rounded-pill border border-line px-5 py-2.5 text-[13.5px] font-medium text-d-text-primary transition-colors hover:bg-hover"
              >
                See the agents argue
              </Link>
            </div>
          </Reveal>
        </div>

        {/* "Kept honest" gate strip, distinct full-width band */}
        <Reveal>
          <div className="dark-media relative mt-10 grid items-center gap-6 overflow-hidden rounded-2xl border p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
            <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border sm:h-32 sm:w-56">
              <Image
                src="/images/v3/ai-signal.webp"
                alt=""
                aria-hidden
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="dark-media-ink-mute inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Built to be trusted
              </p>
              <h3 className="dark-media-ink heading-display mt-2.5 text-[clamp(1.2rem,2.2vw,1.6rem)] font-semibold">
                Nothing trades live until it survives out-of-sample testing.
              </h3>
              <p className="dark-media-ink-soft mt-2.5 max-w-2xl text-[13.5px] leading-relaxed">
                Every strategy is gated and walk-forward tested on data it has never seen before it
                places a single order. Every win and every loss lands on the public{' '}
                <Link href="/proof?tab=track-record" className="dark-media-ink underline underline-offset-4">
                  track record
                </Link>
                . No black boxes. No fabricated returns.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
