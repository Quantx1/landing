'use client'

/**
 * HowItWorks, 4-step flow, revealed on scroll.
 *
 * Sign up → AI scans NSE → Approve signals → Trade manual or auto. The
 * step content IS the label (no "Stage 1 / Step 1" scaffolding). Numbers
 * are a real ordered sequence, so the index earns its place. Brand
 * firewall: copy references the public engine names only.
 */

import Image from 'next/image'
import { UserPlus, Cpu, CheckCheck, Send } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

import { Reveal, RevealGroup, RevealItem } from './_reveal'

interface Step {
  icon: LucideIcon
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    icon: UserPlus,
    title: 'Sign up free',
    body: 'A ₹10,00,000 paper book, live in about 40 seconds. No broker, no card.',
  },
  {
    icon: Cpu,
    title: 'The engines scan NSE',
    body: 'Alpha ranks the board. Regime gates it. Mood checks the news tape. Every session.',
  },
  {
    icon: CheckCheck,
    title: 'Approve signals',
    body: 'Every call lands with a price forecast, engine consensus, and a plain-English why.',
  },
  {
    icon: Send,
    title: 'Trade manual or auto',
    body: 'One click to paper or live on your own broker. Elite hands execution to AutoPilot.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-line bg-wrap/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">How it works</p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
            Signup to first trade. Minutes, not weeks.
          </h2>
        </Reveal>

        {/* ── "Powered by AI" banner ── the on-brand engines→consensus render
            (layered engine plates converging into one signal beam). Pinned to the
            dark surface via .dark-media so it reads as a deliberate dark banner on
            BOTH themes; the explanatory copy sits over a left-anchored gradient
            scrim that keeps it legible. Decorative (alt=""), below the fold → lazy. */}
        <Reveal>
          <div className="dark-media relative mt-10 overflow-hidden rounded-2xl border">
            <Image
              src="/images/v3/ai-engines.webp"
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover object-right opacity-80"
            />
            {/* readability scrim, strongest on the left where the copy sits */}
            <div aria-hidden className="dark-media-scrim-left absolute inset-0" />
            <div className="relative max-w-xl p-6 sm:p-10">
              <p className="dark-media-ink-mute font-mono text-[11px] uppercase tracking-[0.18em]">
                Powered by AI
              </p>
              <h3 className="dark-media-ink heading-display mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-semibold">
                Five engines.{' '}
                <span className="text-gradient font-bold">One gated signal.</span>
              </h3>
              <p className="dark-media-ink-soft mt-3 text-[14px] leading-relaxed">
                Alpha, Regime, Mood, and Counterpoint each read the tape on their own,
                then converge into one gated call. Scored and explained before it ever
                hits your screen.
              </p>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <RevealItem key={step.title} className="bg-wrap">
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-main text-d-text-primary">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className="numeric text-[13px] font-medium text-d-text-muted">0{i + 1}</span>
                </div>
                <h3 className="heading-display mt-5 text-[16px] font-semibold text-d-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-d-text-secondary">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
