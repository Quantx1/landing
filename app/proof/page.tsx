'use client'

/**
 * /proof — unified public trust surface (WP-CONSOLIDATE 3d).
 *
 * Merges the three former public trust pages into one tabbed surface:
 *   ?tab=track-record  → TrackRecordPanel   (default)
 *   ?tab=models        → ModelsPanel  ("Engine accuracy")
 *   ?tab=regime        → RegimePanel
 *
 * Top-level route (OUTSIDE the (platform) auth shell) so it stays
 * crawlable + linkable without an auth gate — the v2 acquisition
 * narrative. Ships the same standalone PublicHeader the old proof pages
 * used (NOT the platform AppShell). Tab state is driven by `?tab=` so
 * every tab has a real deep-linkable URL; the old /models, /track-record
 * and /regime routes 301 here (see middleware.ts).
 *
 * `useSearchParams()` requires a Suspense boundary in the Next.js 14 App
 * Router — the boundary here also covers RegimePanel's `?highlight` read.
 */

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from '@/lib/icons'

import TrackRecordPanel from '@/components/proof/TrackRecordPanel'
import ModelsPanel from '@/components/proof/ModelsPanel'
import RegimePanel from '@/components/proof/RegimePanel'

type ProofTab = 'track-record' | 'models' | 'regime'

// Order: Track record · Engine accuracy · Regime.
const TABS: { key: ProofTab; label: string }[] = [
  { key: 'track-record', label: 'Track record' },
  { key: 'models', label: 'Engine accuracy' },
  { key: 'regime', label: 'Regime' },
]

export default function ProofPage() {
  return (
    <div className="min-h-screen bg-main text-d-text-primary">
      <PublicHeader />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-d-text-muted" />
          </div>
        }
      >
        <ProofContent />
      </Suspense>
    </div>
  )
}

function ProofContent() {
  const searchParams = useSearchParams()
  const raw = searchParams?.get('tab')
  const tab: ProofTab = TABS.some((t) => t.key === raw) ? (raw as ProofTab) : 'track-record'

  return (
    <>
      {/* Tab row — real anchor hrefs so each tab is deep-linkable + crawlable. */}
      <div className="border-b border-line">
        <nav className="max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto" aria-label="Proof sections">
          {TABS.map((t) => {
            const active = t.key === tab
            return (
              <Link
                key={t.key}
                href={`/proof?tab=${t.key}`}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-[13px] font-medium transition-colors ${
                  active
                    ? 'border-primary text-d-text-primary'
                    : 'border-transparent text-d-text-muted hover:text-d-text-primary'
                }`}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {tab === 'track-record' && <TrackRecordPanel />}
      {tab === 'models' && <ModelsPanel />}
      {tab === 'regime' && <RegimePanel />}
    </>
  )
}

// Shared standalone public header — the same chrome the old /models,
// /track-record and /regime pages shipped (brand + pricing + signup),
// minus the now-redundant per-surface links (the tabs cover those).
function PublicHeader() {
  return (
    <div className="border-b border-line">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-[14px] font-semibold text-d-text-primary">
          Quant <span className="text-primary">X</span>
        </Link>
        <div className="flex items-center gap-4 text-[12px] text-d-text-muted">
          <Link href="/pricing" className="hover:text-d-text-primary">Pricing</Link>
          <Link
            href="/signup"
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-colors font-medium"
          >
            Start free
          </Link>
        </div>
      </div>
    </div>
  )
}
