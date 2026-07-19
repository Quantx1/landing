'use client'

/**
 * TrackRecordBar, the proof section. LIVE data only.
 *
 * Pulls real stats from `api.publicTrust.trackRecord` + the live regime
 * from `regimeHistory` (unauth, CDN-cached), same endpoints as before.
 * Counts animate up with the vendored NumberTicker; the cumulative-return
 * curve renders the same shape the /track-record page shows. NO fabricated
 * numbers: every value is read, and the strip shows a dash placeholder
 * until data lands (no fake metrics on a fresh deployment).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { api } from '@/lib/api'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Reveal } from './_reveal'

interface TrackStats {
  n: number
  win_rate: number
  avg_return_pct: number
  best_return_pct: number
  best_symbol: string | null
}

interface CurvePoint {
  date: string
  cum_return_pct: number
}

const REGIME_TEXT: Record<string, string> = {
  bull: 'text-up',
  sideways: 'text-warning',
  bear: 'text-down',
}

export default function TrackRecordBar() {
  const [stats, setStats] = useState<TrackStats | null>(null)
  const [curve, setCurve] = useState<CurvePoint[]>([])
  const [regime, setRegime] = useState<{ name: string; conf: number } | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [tr, reg] = await Promise.all([
        api.publicTrust.trackRecord({ days: 30, limit: 1 }).catch(() => null),
        api.publicTrust.regimeHistory(7).catch(() => null),
      ])
      if (!active) return
      if (tr?.stats) setStats(tr.stats as TrackStats)
      if (Array.isArray(tr?.curve)) setCurve(tr!.curve as CurvePoint[])
      const cur = (reg as any)?.current
      if (cur?.regime) {
        const name = String(cur.regime).toLowerCase()
        const confKey = `prob_${name}` as 'prob_bull' | 'prob_sideways' | 'prob_bear'
        setRegime({ name, conf: Number(cur[confKey] || 0) })
      }
    })()
    return () => { active = false }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Left: claim */}
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-d-text-muted">Track record</p>
          <h2 className="heading-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold text-d-text-primary">
            Every closed trade is{' '}
            <span className="text-gradient font-bold">public.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-d-text-secondary">
            Wins and losses. Both on the table. The numbers on the right read live
            off the same ledger the{' '}
            <Link href="/proof?tab=track-record" className="text-d-text-primary underline-offset-4 hover:underline">
              full track record
            </Link>{' '}
            renders. No cherry-picking.
          </p>
        </Reveal>

        {/* Right: live stat panel */}
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-line bg-wrap">
            <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
              <Stat
                label="Signals · 30d"
                node={stats ? <NumberTicker value={stats.n} className="text-[26px] font-semibold" /> : <Dash />}
              />
              <Stat
                label="Win rate"
                node={
                  stats ? (
                    <span className={stats.win_rate >= 0.5 ? 'text-up' : 'text-warning'}>
                      <NumberTicker value={stats.win_rate * 100} decimalPlaces={1} className="text-[26px] font-semibold text-inherit" />
                      <span className="numeric text-[16px] font-semibold">%</span>
                    </span>
                  ) : <Dash />
                }
              />
              <Stat
                label="Avg return"
                node={
                  stats ? (
                    <span className={stats.avg_return_pct >= 0 ? 'text-up' : 'text-down'}>
                      <span className="numeric text-[26px] font-semibold">{stats.avg_return_pct >= 0 ? '+' : ''}</span>
                      <NumberTicker value={stats.avg_return_pct} decimalPlaces={2} className="text-[26px] font-semibold text-inherit" />
                      <span className="numeric text-[16px] font-semibold">%</span>
                    </span>
                  ) : <Dash />
                }
              />
              <Stat
                label="Regime now"
                sub={regime ? `${Math.round(regime.conf * 100)}% conf` : undefined}
                node={
                  regime ? (
                    <span className={`text-[22px] font-semibold capitalize ${REGIME_TEXT[regime.name] || 'text-d-text-muted'}`}>
                      {regime.name}
                    </span>
                  ) : <Dash />
                }
              />
            </div>

            {curve.length >= 2 && (
              <div className="border-t border-line px-5 py-4">
                <CurveSparkline curve={curve} />
              </div>
            )}

            <div className="flex items-center justify-between border-t border-line px-5 py-3">
              <p className="text-[12px] text-d-text-muted">
                {stats?.best_symbol ? (
                  <>
                    Top call · 30d · <span className="text-d-text-secondary">{stats.best_symbol}</span>{' '}
                    <span className="numeric text-up">+{stats.best_return_pct.toFixed(1)}%</span>
                  </>
                ) : (
                  'Live ledger · updates every session'
                )}
              </p>
              <Link href="/proof?tab=track-record" className="text-[12px] font-medium text-d-text-primary hover:opacity-70">
                Full record &rarr;
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Stat({ label, node, sub }: { label: string; node: React.ReactNode; sub?: string }) {
  return (
    <div className="px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-d-text-muted">{label}</p>
      <div className="numeric mt-1.5 text-d-text-primary">{node}</div>
      {sub && <p className="mt-0.5 text-[10px] text-d-text-muted">{sub}</p>}
    </div>
  )
}

function Dash() {
  return <span className="text-[26px] font-semibold text-d-text-muted">--</span>
}

function CurveSparkline({ curve }: { curve: CurvePoint[] }) {
  const values = curve.map((p) => p.cum_return_pct)
  const minV = Math.min(0, ...values)
  const maxV = Math.max(0, ...values)
  const span = Math.max(0.001, maxV - minV)
  const last = values[values.length - 1] ?? 0
  const positive = last >= 0
  const lineColor = positive ? 'var(--color-up)' : 'var(--color-down)'
  const fillStart = positive
    ? 'color-mix(in srgb, var(--color-up) 16%, transparent)'
    : 'color-mix(in srgb, var(--color-down) 16%, transparent)'

  const W = 600
  const H = 56
  const xStep = curve.length > 1 ? W / (curve.length - 1) : 0
  const yFor = (v: number) => H - ((v - minV) / span) * H
  const zeroY = yFor(0)
  const linePath = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * xStep).toFixed(1)},${yFor(p.cum_return_pct).toFixed(1)}`)
    .join(' ')
  const fillPath = `${linePath} L${((curve.length - 1) * xStep).toFixed(1)},${H} L0,${H} Z`

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-d-text-muted">
        <span>Cumulative return · last {curve.length} sessions</span>
        <span className="numeric" style={{ color: lineColor }}>
          {last >= 0 ? '+' : ''}{last.toFixed(2)}%
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[44px] w-full" preserveAspectRatio="none" aria-label="Cumulative return curve">
        {minV < 0 && maxV > 0 && (
          <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="currentColor" className="text-line" strokeWidth={0.5} />
        )}
        <path d={fillPath} fill={fillStart} />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth={1.5} />
      </svg>
    </div>
  )
}
