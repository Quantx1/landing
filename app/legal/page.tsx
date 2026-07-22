import Link from 'next/link'
import type { Metadata } from 'next'
import { HomeFooter } from '@/components/home/HomeFooter'

export const metadata: Metadata = { title: 'Legal & Policies | Quant X' }

const DOCS: { slug: string; title: string; blurb: string }[] = [
  { slug: 'terms', title: 'Terms of Service', blurb: 'The agreement that governs your use of Quant X.' },
  { slug: 'privacy', title: 'Privacy Policy', blurb: 'What we collect, how we use it, and your rights (DPDP-aligned).' },
  { slug: 'disclaimer', title: 'Disclaimer', blurb: 'Not investment advice; not SEBI-registered as RA/IA.' },
  { slug: 'risk', title: 'Risk Disclosure', blurb: 'Market, derivatives and algorithmic-trading risks.' },
  { slug: 'refund', title: 'Refund & Cancellation', blurb: 'Subscription billing, cancellation and refunds.' },
]

export default function LegalIndexPage() {
  return (
    <main className="min-h-screen bg-main px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-d-text-muted">Quant X</p>
        <h1 className="heading-display mt-2 text-3xl text-d-text-primary">Legal &amp; Policies</h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-d-text-secondary">
          Draft templates pending review by a SEBI-registered legal/compliance professional. Placeholders in brackets must be completed before publication.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {DOCS.map((d) => (
            <Link
              key={d.slug}
              href={`/legal/${d.slug}`}
              className="glass-card group rounded-2xl border border-line p-5 transition-shadow hover:ring-1 hover:ring-primary/25"
            >
              <h2 className="text-[15px] font-semibold text-d-text-primary group-hover:text-primary">{d.title}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-d-text-muted">{d.blurb}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-1">
        <HomeFooter />
      </div>
    </main>
  )
}
