'use client'

/**
 * TrustPillars, the honest answer to the category-standard "what our users are
 * saying" testimonial / stat band. Instead of fabricated quotes or invented win-rate
 * lifts, this band states the three transparency commitments that actually
 * differentiate Quant X, each paired with a real, verifiable surface.
 *
 * Honest by construction: no numbers are claimed here that aren't read live
 * elsewhere on the page (TrackRecordBar) or auditable on the linked pages.
 */

import Link from 'next/link'
import { Eye, GitBranch, ShieldCheck } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

import { Reveal, RevealGroup, RevealItem } from './_reveal'
import { appUrl } from '@/lib/app-url'

interface Pillar {
  icon: LucideIcon
  title: string
  body: string
  href: string
  link: string
}

const PILLARS: Pillar[] = [
  {
    icon: Eye,
    title: 'Every trade, in the open',
    body: 'Wins and losses, the full ledger. Nothing hand-picked, nothing buried. The numbers update each session.',
    href: '/proof?tab=track-record',
    link: 'See the track record',
  },
  {
    icon: GitBranch,
    title: 'Named engines, no black box',
    body: 'Five engines you can name: Alpha, Mood, Regime, Counterpoint, AutoPilot. You see the consensus and the case against it.',
    href: '/proof?tab=models',
    link: 'See live model accuracy',
  },
  {
    icon: ShieldCheck,
    title: 'Gated before it ships',
    body: 'No signal goes live until it clears a risk gate and a backtest. Hard stops stay authoritative on every trade.',
    href: appUrl('/signals'),
    link: 'How signals work',
  },
]

export default function TrustPillars() {
  return (
    <section className="border-y border-line bg-wrap/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">No spin. Just the receipts</p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
            Transparent by design, not by{' '}
            <span className="text-gradient font-bold">claim.</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3" amount={0.15}>
          {PILLARS.map((p) => (
            <RevealItem key={p.title} className="bg-wrap">
              <div className="flex h-full flex-col p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-main text-d-text-primary">
                  <p.icon className="h-4 w-4" />
                </span>
                <h3 className="heading-display mt-5 text-[18px] font-semibold text-d-text-primary">{p.title}</h3>
                <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-d-text-secondary">{p.body}</p>
                <Link
                  href={p.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-d-text-primary transition-opacity hover:opacity-70"
                >
                  {p.link} <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
