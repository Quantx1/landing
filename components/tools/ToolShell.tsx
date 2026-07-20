'use client'

/**
 * Shared chrome for every free tool page.
 *
 * Layout is a two-column split at lg — inputs on the left, results sticky on
 * the right — collapsing to stacked on mobile. Everything below the fold
 * (about copy, FAQ, related tools) is static prose that exists as much for
 * search engines as for readers.
 *
 * These pages are fully public: no auth, no API calls, no user data. Keep it
 * that way — the whole point is that they load fast and work for logged-out
 * visitors.
 */

import Link from 'next/link'
import LightNavbar from '@/components/landing/LightNavbar'
import Footer from '@/components/landing/Footer'
import { Card } from '@/components/foundation'
import { ArrowRight, ArrowLeft } from '@/lib/icons'
import { TOOLS, type Tool } from '@/lib/tools/registry'
import { RATES_EFFECTIVE } from '@/lib/tools/rates'

export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const Icon = tool.icon
  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-d-bg">
      <LightNavbar />

      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs text-d-text-muted transition hover:text-d-text-primary"
          >
            <ArrowLeft size={14} />
            All free tools
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-d-border bg-wrap">
              <Icon size={20} className="text-d-text-primary" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">
                Free tool · {tool.category}
              </p>
              <h1 className="heading-display mt-1.5 text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.1] text-d-text-primary">
                {tool.name}
              </h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-d-text-secondary">
                {tool.tagline} No sign-up, no limits — everything runs in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">{children}</section>

      <section className="border-t border-d-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-lg font-semibold text-d-text-primary">About this calculator</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-d-text-secondary">{tool.about}</p>

          <h2 className="mt-12 text-lg font-semibold text-d-text-primary">Common questions</h2>
          <div className="mt-5 space-y-6">
            {tool.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-[15px] font-medium text-d-text-primary">{f.q}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-d-text-secondary">{f.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-d-border pt-6 text-[12px] leading-relaxed text-d-text-muted">
            For education only — not investment, tax or legal advice. Statutory rates last
            reviewed {RATES_EFFECTIVE} and change by circular; verify against current NSE, SEBI
            and Income Tax notifications before acting on any figure here.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-d-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-lg font-semibold text-d-text-primary">Related tools</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {related.map((t) => {
                const RIcon = t.icon
                return (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
                    <Card variant="clickable" className="h-full p-4 transition hover:border-wrap-line">
                      <RIcon size={18} className="text-d-text-muted" />
                      <h3 className="mt-3 text-sm font-medium text-d-text-primary">{t.name}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-d-text-muted">{t.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-d-text-secondary transition group-hover:gap-1.5">
                        Open <ArrowRight size={12} />
                      </span>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

/* ───────────────────────── layout helpers ───────────────────────── */

/** Two-column input/result split used by every calculator. */
export function ToolLayout({ inputs, results }: { inputs: React.ReactNode; results: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <Card className="p-5 sm:p-6">
        <div className="space-y-5">{inputs}</div>
      </Card>
      <div className="lg:sticky lg:top-24">{results}</div>
    </div>
  )
}

/** Headline figure at the top of the results panel. */
export function ResultHeadline({
  label,
  value,
  tone = 'neutral',
  hint,
}: {
  label: string
  value: string
  tone?: 'up' | 'down' | 'neutral'
  hint?: string
}) {
  const toneClass =
    tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-d-text-primary'
  return (
    <div className="border-b border-line px-5 py-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">{label}</p>
      <p className={`numeric mt-2 text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1.5 text-xs text-d-text-muted">{hint}</p>}
    </div>
  )
}

/** One line in the results breakdown. */
export function ResultRow({
  label,
  value,
  tone = 'neutral',
  strong = false,
  hint,
}: {
  label: string
  value: string
  tone?: 'up' | 'down' | 'neutral'
  strong?: boolean
  hint?: string
}) {
  const toneClass = tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-d-text-primary'
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-2.5">
      <span className={`text-[13px] ${strong ? 'font-medium text-d-text-primary' : 'text-d-text-secondary'}`}>
        {label}
        {hint && <span className="ml-1.5 text-[11px] text-d-text-muted">{hint}</span>}
      </span>
      <span className={`numeric text-[13.5px] ${strong ? 'font-semibold' : ''} ${toneClass}`}>{value}</span>
    </div>
  )
}

export function ResultPanel({ children }: { children: React.ReactNode }) {
  return <Card className="overflow-hidden">{children}</Card>
}

export function ResultGroup({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="border-b border-line py-2 last:border-b-0">
      {title && (
        <p className="px-5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-d-text-muted">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

/* ───────────────────────── formatting ───────────────────────── */

export const inr = (n: number, decimals = 2): string =>
  `₹${(Number.isFinite(n) ? n : 0).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`

/** Compact INR for large corpus figures — ₹1.23 Cr / ₹45.6 L. */
export const inrCompact = (n: number): string => {
  const v = Number.isFinite(n) ? n : 0
  const abs = Math.abs(v)
  if (abs >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`
  return inr(v, 0)
}

export const pct = (n: number, decimals = 2): string =>
  `${(Number.isFinite(n) ? n : 0).toFixed(decimals)}%`

export const num = (n: number, decimals = 0): string =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
