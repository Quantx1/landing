import Link from 'next/link'
import { appUrl } from '@/lib/app-url'

/**
 * Footer, v2. Honest + dead-link-free.
 *
 * Fixes from the 2026-06-18 audit:
 *   • only real, existing routes (no `href="#"` placeholders),
 *   • no fabricated socials (the old 6 were all `#`),
 *   • SEBI line reads "registration pending" to match /terms (was the
 *     contradictory "SEBI Registered"),
 *   • support email aligned to @quantx.app (matches /terms).
 * Educational-not-advice disclaimer retained.
 */

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Trading Signals', href: appUrl('/signals') },
      { label: 'Momentum Picks', href: appUrl('/momentum') },
      { label: 'Market Regime', href: '/proof?tab=regime' },
      { label: 'Model Accuracy', href: '/proof?tab=models' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Track Record', href: '/proof?tab=track-record' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Stock Browser', href: appUrl('/stocks') },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

const exchanges = [
  { label: 'BSE', href: 'https://www.bseindia.com/' },
  { label: 'NSE', href: 'https://www.nseindia.com/' },
  { label: 'SEBI', href: 'https://www.sebi.gov.in/' },
  { label: 'CDSL', href: 'https://www.cdslindia.com/' },
  { label: 'SCORES', href: 'https://scores.sebi.gov.in/' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-main">
      {/* Hairline signature top edge, the ONE gradient family */}
      <div aria-hidden className="bg-gradient-signature absolute inset-x-0 top-0 h-px opacity-60" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="bg-gradient-signature flex h-7 w-7 items-center justify-center rounded-[7px]">
                <span className="font-display text-[15px] font-bold text-on-signature">Q</span>
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-d-text-primary">Quant X</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-d-text-secondary">
              The AI trading desk for Indian equities and F&amp;O. Gated signals,
              every call explained, track record in the open. Paper-trade free.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-d-text-muted">
              Built in India · for NSE &amp; BSE
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-d-text-muted">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-d-text-secondary transition-colors hover:text-d-text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Exchange links */}
        <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 text-[12px] text-d-text-muted">
          <span className="font-medium text-d-text-secondary">Regulators &amp; exchanges</span>
          {exchanges.map((e) => (
            <a
              key={e.label}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-d-text-primary"
            >
              {e.label}
            </a>
          ))}
        </div>

        {/* Legal / disclaimer */}
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-[12px] text-d-text-muted">
            &copy; {new Date().getFullYear()} Quant X. SEBI Research Analyst registration pending.
          </p>
          <p className="mt-3 max-w-4xl text-[11px] leading-[1.7] text-d-text-muted">
            Trading and investment in securities markets involves substantial risk of loss.
            Past performance of any strategy or model does not guarantee future results.
            Quant X is an educational tool and does not provide investment advice, personalised
            recommendations or portfolio management services. All AI-generated signals are for
            informational purposes only and do not constitute buy or sell recommendations. You are
            solely responsible for your own investment decisions.
          </p>
          <p className="mt-3 text-[11px] text-d-text-muted">
            Got a question? Reach us at{' '}
            <a href="mailto:support@quantx.app" className="text-d-text-secondary hover:text-d-text-primary">
              support@quantx.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
