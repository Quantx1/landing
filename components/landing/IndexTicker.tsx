'use client'

/**
 * IndexTicker, live ticker-tape strip of NSE/BSE index quotes.
 *
 * Real data from `api.publicTrust.indices()` (unauth, 30s CDN cache), the
 * same public endpoint the hero reads. Mono tabular numerics + duotone
 * up/down %. Constant motion → linear marquee (motion standards); pauses on
 * hover; collapses to static under reduced-motion. The track is duplicated
 * so a -50% translate is one seamless loop.
 *
 * Honest-empty: if the endpoint hasn't responded the strip renders a calm
 * placeholder row rather than fabricating prices.
 */

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface IndexRow {
  key: string
  label: string
  last: number | null
  change: number | null
  change_pct: number | null
}

export default function IndexTicker() {
  const [rows, setRows] = useState<IndexRow[]>([])

  useEffect(() => {
    let active = true
    api.publicTrust
      .indices()
      .then((res) => {
        if (active && res?.indices) setRows(res.indices)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  // Two-pass duplication for the seamless loop. Placeholder keeps the strip
  // from collapsing before data lands.
  const display = rows.length > 0 ? rows : PLACEHOLDER

  return (
    <div className="relative border-y border-line bg-wrap/40">
      <div className="marquee-pause relative overflow-hidden mask-edge-fade py-3">
        <div
          className="flex w-max items-center gap-10 whitespace-nowrap animate-marquee"
          style={{ ['--marquee-duration' as string]: '46s' }}
        >
          {[...display, ...display].map((r, i) => (
            <Quote key={`${r.key}-${i}`} row={r} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Quote({ row }: { row: IndexRow }) {
  const hasData = row.last != null
  const up = (row.change_pct ?? 0) >= 0
  return (
    <span className="inline-flex shrink-0 items-baseline gap-2.5 text-[13px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-d-text-muted">
        {row.label}
      </span>
      <span className="numeric font-medium text-d-text-primary">
        {hasData
          ? row.last!.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '----'}
      </span>
      {hasData && row.change_pct != null && (
        <span className={`numeric text-[12px] ${up ? 'text-up' : 'text-down'}`}>
          {up ? '+' : ''}
          {row.change_pct.toFixed(2)}%
        </span>
      )}
    </span>
  )
}

const PLACEHOLDER: IndexRow[] = [
  { key: 'nifty', label: 'Nifty 50', last: null, change: null, change_pct: null },
  { key: 'banknifty', label: 'Bank Nifty', last: null, change: null, change_pct: null },
  { key: 'sensex', label: 'Sensex', last: null, change: null, change_pct: null },
  { key: 'vix', label: 'India VIX', last: null, change: null, change_pct: null },
]
