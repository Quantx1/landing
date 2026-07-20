import type { Metadata } from 'next'
import Link from 'next/link'
import LightNavbar from '@/components/landing/LightNavbar'
import Footer from '@/components/landing/Footer'
import { Card } from '@/components/foundation'
import { ArrowRight } from '@/lib/icons'
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools/registry'

export const metadata: Metadata = {
  title: 'Free Trading & Investment Calculators for Indian Markets',
  description:
    'Twelve free calculators for NSE traders and investors — brokerage and STT, position sizing, risk-reward, SIP, CAGR, capital gains tax and more. No sign-up required.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'Free Trading & Investment Calculators',
    description:
      'Brokerage, position sizing, risk-reward, SIP, CAGR and capital gains calculators for Indian markets. Free, no sign-up.',
    url: '/tools',
    type: 'website',
  },
}

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-d-bg">
      <LightNavbar />

      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-24 text-center sm:px-6 sm:pt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">
            Free · No sign-up
          </p>
          <h1 className="heading-display mt-3 text-4xl font-bold tracking-tight text-d-text-primary sm:text-5xl">
            Trading &amp; investing <span className="gradient-text-teal">calculators</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-d-text-secondary">
            {TOOLS.length} calculators built for Indian markets — real STT and stamp duty rates,
            rupee formatting, NSE conventions. Everything runs in your browser. Nothing is stored,
            nothing is sent anywhere.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {TOOL_CATEGORIES.map((category) => {
          const tools = TOOLS.filter((t) => t.category === category)
          if (tools.length === 0) return null

          return (
            <div key={category} className="mt-12 first:mt-4">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">
                {category}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                      <Card
                        variant="clickable"
                        className="h-full p-5 transition hover:border-wrap-line"
                      >
                        <Icon size={20} className="text-d-text-muted transition group-hover:text-d-text-primary" />
                        <h3 className="mt-3.5 text-[15px] font-medium text-d-text-primary">
                          {tool.name}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-d-text-muted">
                          {tool.tagline}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs text-d-text-secondary transition-all group-hover:gap-1.5">
                          Open <ArrowRight size={12} />
                        </span>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}

        <p className="mt-16 border-t border-d-border pt-6 text-[12px] leading-relaxed text-d-text-muted">
          These calculators are for education only and do not constitute investment, tax or legal
          advice. Statutory rates change by circular — verify against current NSE, SEBI and Income
          Tax notifications before acting on any figure.
        </p>
      </section>

      <Footer />
    </div>
  )
}
