'use client'

/**
 * LandingFaq, honest FAQ accordion for the marketing page.
 *
 * Reuses the production FaqAccordion (same component the signal pages use).
 * Answers are honest: SEBI status, no fabricated returns, paper-trading,
 * brokers, brand firewall (public engine names only).
 */

import Link from 'next/link'

import { FaqAccordion } from '@/components/signals/FaqAccordion'
import { Reveal } from './_reveal'

const ITEMS = [
  {
    q: 'Is Quant X SEBI registered?',
    a: 'SEBI Research Analyst registration is pending. Quant X is an educational tool. Every signal is informational only, not personalised investment advice. The call is yours, and so is the risk.',
  },
  {
    q: 'Do I need a broker or a card to start?',
    a: 'No. Sign up and you get a virtual ₹10,00,000 paper portfolio. Trade the full AI stack with zero rupees at stake. Connect a broker (Zerodha, Upstox, Angel One and others, via direct OAuth) only when you decide to go live.',
  },
  {
    q: 'How are the signals generated?',
    a: 'Five engines read the tape, each on its own. Alpha ranks the NSE board, Regime gates it to the market state, Mood cross-checks the news tape, Counterpoint argues the other side. They converge into one gated signal: entry, stop, target, confidence. Copilot explains it in plain English.',
  },
  {
    q: 'Are the performance numbers real?',
    a: 'Only the real ones ship. The track record reads live from the same ledger that logs every closed trade, wins and losses alike. Nothing cherry-picked. The screenshots on this page show the real interface with representative example values, not live results or returns.',
  },
  {
    q: 'What does each tier include?',
    a: 'Free: paper-trade one signal a day. Pro (₹999/mo): the full signal stack, the scanner and weekly momentum. Elite (₹1,999/mo): AutoPilot execution on your own broker, F&O strategies and unlimited Copilot. Cancel anytime.',
  },
  {
    q: 'Can the AI place trades for me?',
    a: 'On Elite, and only after you opt in. AutoPilot runs the top-ranked names on your own broker with position sizing and a daily rebalance. It is supervised: hard stop-losses stay authoritative, and you stay in control.',
  },
]

export default function LandingFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-24">
      <Reveal className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">FAQ</p>
        <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
          Straight answers. No spin.
        </h2>
        <p className="mt-4 text-[15px] text-d-text-secondary">
          More in our{' '}
          <Link href="/terms" className="text-d-text-primary underline-offset-4 hover:underline">
            terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-d-text-primary underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </Reveal>

      <div className="mt-10">
        <FaqAccordion items={ITEMS} />
      </div>
    </section>
  )
}
