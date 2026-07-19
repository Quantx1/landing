'use client'

/**
 * TrackRecordPanel — body-only "Track record" panel for the /proof surface.
 *
 * Extracted verbatim from the retired /track-record page (WP-CONSOLIDATE 3d).
 * Regime banner · cumulative-return curve · expanded stats strip · filter row ·
 * per-signal engine chips + wins/losses/expired. Every trade shown is
 * verifiable — no hidden drawer.
 *
 * Body-only: no PublicHeader, no page wrapper — the /proof page shell
 * provides those and the tab chrome.
 */

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Loader2 } from '@/lib/icons'

import { api } from '@/lib/api'
import { MONO } from '@/lib/tokens'
import { EyebrowMono } from '@/components/foundation'
import ModelBadge from '@/components/ModelBadge'
import type { PublicModelKey } from '@/lib/models'

interface TrackStats {
  n: number
  wins: number
  losses: number
  expired: number
  win_rate: number
  avg_return_pct: number
  avg_win_pct: number
  avg_loss_pct: number
  profit_factor: number | null
  best_return_pct: number
  best_symbol: string | null
  worst_return_pct: number
  worst_symbol: string | null
}

interface TrackSignal {
  id: string
  symbol: string
  direction: 'LONG' | 'SHORT'
  segment: string
  entry_price: number
  exit_price: number
  target_1: number | null
  stop_loss: number
  return_pct: number
  result: 'target' | 'stop' | 'expired'
  status: string
  date: string
  confidence: number
  engines: PublicModelKey[]
  regime_at_signal: string | null
  model_agreement: number | null
}

interface CurvePoint {
  date: string
  cum_return_pct: number
}

type SegmentFilter = '' | 'EQUITY' | 'FUTURES' | 'OPTIONS'
type DirectionFilter = '' | 'LONG' | 'SHORT'

export default function TrackRecordPanel() {
  const [days, setDays] = useState<30 | 90 | 365>(90)
  const [segment, setSegment] = useState<SegmentFilter>('')
  const [direction, setDirection] = useState<DirectionFilter>('')
  const [data, setData] = useState<{
    stats: TrackStats
    signals: TrackSignal[]
    curve: CurvePoint[]
    currentRegime: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const res = await api.publicTrust.trackRecord({
          days,
          segment: segment || undefined,
          direction: direction || undefined,
          limit: 300,
        })
        if (!cancelled) {
          setData({
            stats: res.stats as TrackStats,
            signals: (res.signals as any[]) as TrackSignal[],
            curve: (res.curve as CurvePoint[]) || [],
            currentRegime: res.current_regime?.regime || null,
          })
          setError(null)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [days, segment, direction])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <EyebrowMono className="mb-2">Verifiable signal history</EyebrowMono>
        <h1 className="heading-display text-[28px] md:text-[34px] font-normal text-d-text-primary">
          Track record
        </h1>
        <p className="text-[13px] text-d-text-secondary mt-2 max-w-2xl">
          Every closed signal, last {days} days. Wins <strong className="text-up">and</strong> losses.{' '}
          Entry / exit / realized return computed from the signal row as saved at entry time.
        </p>
      </div>

      {/* ── Regime banner ── */}
      {data?.currentRegime && <RegimeBanner regime={data.currentRegime} />}

      {/* ── Stats strip ── */}
      {loading && !data ? (
        <div className="rounded-sm border border-line bg-wrap flex items-center justify-center min-h-[80px]">
          <Loader2 className="w-5 h-5 text-d-text-muted animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-sm border border-down/40 bg-down/[0.06] p-4 text-down text-[12px]">{error}</div>
      ) : data && (
        <StatsStrip stats={data.stats} />
      )}

      {/* ── Cumulative return curve ── */}
      {data && data.curve.length > 1 && <CurveCard curve={data.curve} />}

      {/* ── Win / loss / expired distribution ── */}
      {data && data.stats.n > 0 && <DistributionBar stats={data.stats} />}

      {/* ── PR 85 — per-engine breakdown ── */}
      {data && data.signals.length > 0 && <EngineBreakdown signals={data.signals} />}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <ButtonGroup
          label="Window"
          value={String(days)}
          options={[['30', '30d'], ['90', '90d'], ['365', '1y']]}
          onChange={(v) => setDays(Number(v) as 30 | 90 | 365)}
        />
        <ButtonGroup
          label="Segment"
          value={segment}
          options={[['', 'All'], ['EQUITY', 'Equity'], ['FUTURES', 'Futures'], ['OPTIONS', 'Options']]}
          onChange={(v) => setSegment(v as SegmentFilter)}
        />
        <ButtonGroup
          label="Direction"
          value={direction}
          options={[['', 'All'], ['LONG', 'Long'], ['SHORT', 'Short']]}
          onChange={(v) => setDirection(v as DirectionFilter)}
        />
      </div>

      {/* ── Signals list — table on md+, cards on mobile ── */}
      {data && (
        <>
          {/* md+: full table */}
          <div className="rounded-sm border border-line bg-wrap overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] min-w-[760px]">
                <thead className="text-d-text-muted border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 font-normal">Symbol</th>
                    <th className="text-left px-2 py-3 font-normal">Dir</th>
                    <th className="text-right px-2 py-3 font-normal">Entry</th>
                    <th className="text-right px-2 py-3 font-normal">Exit</th>
                    <th className="text-right px-2 py-3 font-normal">Return</th>
                    <th className="text-left px-2 py-3 font-normal">Result</th>
                    <th className="text-left px-2 py-3 font-normal">Engines</th>
                    <th className="text-left px-2 py-3 font-normal">Regime</th>
                    <th className="text-right px-4 py-3 font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.signals.map((s) => (
                    <SignalRow key={s.id} row={s} />
                  ))}
                  {!data.signals.length && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-d-text-muted">
                        No closed signals matching these filters yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* mobile: stacked cards */}
          <div className="md:hidden space-y-2">
            {data.signals.map((s) => (
              <SignalCardMobile key={s.id} row={s} />
            ))}
            {!data.signals.length && (
              <div className="rounded-sm border border-line bg-wrap text-center text-[12px] text-d-text-muted py-8">
                No closed signals matching these filters yet.
              </div>
            )}
          </div>
        </>
      )}

      <p className="text-[10px] text-d-text-muted pt-6 border-t border-line">
        Past performance ≠ future. Figures before transaction costs (STT / brokerage / GST) and
        tax. Market investments are subject to risk.
      </p>
    </div>
  )
}

// ------------------------------------------------------------- subcomponents

// Tone → Tailwind text class (tri-theme safe, duotone numbers-only).
type Tone = 'up' | 'warning' | 'down' | 'neutral'
const TONE_TEXT: Record<Tone, string> = {
  up: 'text-up',
  warning: 'text-warning',
  down: 'text-down',
  neutral: 'text-d-text-primary',
}

function RegimeBanner({ regime }: { regime: string }) {
  const tone: { cls: string; tint: string; label: string } =
    regime === 'bull' ? { cls: 'text-up', tint: 'border-up/40 bg-up/[0.06]', label: 'Bull' } :
    regime === 'bear' ? { cls: 'text-down', tint: 'border-down/40 bg-down/[0.06]', label: 'Bear' } :
                        { cls: 'text-warning', tint: 'border-warning/40 bg-warning/[0.06]', label: 'Sideways' }
  return (
    <div className={`flex items-center justify-between rounded-sm border px-4 py-3 text-[12px] ${tone.tint}`}>
      <div className="flex items-center gap-3">
        <ModelBadge modelKey="regime_detector" size="xs" variant="soft" />
        <span className="text-d-text-muted">Current regime</span>
        <span className={`font-semibold ${tone.cls}`}>{tone.label}</span>
      </div>
      <Link href="/proof?tab=regime" className="text-d-text-muted hover:text-d-text-primary">View timeline →</Link>
    </div>
  )
}

function StatsStrip({ stats }: { stats: TrackStats }) {
  const winTone: Tone = stats.win_rate >= 0.5 ? 'up' : 'warning'
  const avgTone: Tone = stats.avg_return_pct >= 0 ? 'up' : 'down'
  const pf = stats.profit_factor
  const pfDisplay = pf === null ? '∞' : pf.toFixed(2)
  const pfTone: Tone = pf === null || (pf ?? 0) >= 1 ? 'up' : 'down'
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <Stat label="Closed" value={stats.n} numeric />
      <Stat label="Win rate" value={`${(stats.win_rate * 100).toFixed(1)}%`} tone={winTone} />
      <Stat label="Avg return" value={`${stats.avg_return_pct >= 0 ? '+' : ''}${stats.avg_return_pct.toFixed(2)}%`} tone={avgTone} />
      <Stat label="Avg win" value={`+${stats.avg_win_pct.toFixed(2)}%`} tone="up" />
      <Stat label="Avg loss" value={`${stats.avg_loss_pct.toFixed(2)}%`} tone="down" />
      <Stat label="Profit factor" value={pfDisplay} tone={pfTone} />
      <Stat
        label="Best · Worst"
        value={`${stats.best_symbol || '—'}`}
        sub={`+${stats.best_return_pct.toFixed(1)}% · ${stats.worst_return_pct.toFixed(1)}% ${stats.worst_symbol || ''}`}
        tone="up"
      />
    </div>
  )
}

function CurveCard({ curve }: { curve: CurvePoint[] }) {
  // Sample to ≤120 points for a compact SVG.
  const sampled = useMemo(() => {
    if (curve.length <= 120) return curve
    const step = Math.ceil(curve.length / 120)
    return curve.filter((_, i) => i % step === 0 || i === curve.length - 1)
  }, [curve])

  const values = sampled.map((p) => p.cum_return_pct)
  const min = Math.min(0, ...values)
  const max = Math.max(0, ...values)
  const range = max - min || 1
  const w = 1000
  const h = 160
  const pad = 8

  const points = sampled.map((p, i) => {
    const x = pad + (i / Math.max(1, sampled.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (p.cum_return_pct - min) / range) * (h - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const last = sampled[sampled.length - 1]?.cum_return_pct ?? 0
  const positive = last >= 0
  const strokeVar = positive ? 'var(--color-up)' : 'var(--color-down)'

  const zeroY = pad + (1 - (0 - min) / range) * (h - pad * 2)

  return (
    <div className="rounded-sm border border-line bg-wrap p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <EyebrowMono>Cumulative return</EyebrowMono>
          <p className="text-[11px] text-d-text-muted mt-0.5">
            Running sum of realized %, closed signals oldest → newest
          </p>
        </div>
        <div className="text-right">
          <p className={`${MONO} text-[20px] font-normal ${positive ? 'text-up' : 'text-down'}`}>
            {positive ? '+' : ''}{last.toFixed(2)}%
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-[160px]">
        <line x1={pad} x2={w - pad} y1={zeroY} y2={zeroY} stroke="var(--color-line)" strokeWidth={1} strokeDasharray="3 3" />
        <polyline
          fill="none"
          stroke={strokeVar}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  )
}

function DistributionBar({ stats }: { stats: TrackStats }) {
  const { wins, losses, expired, n } = stats
  const winPct = n ? (wins / n) * 100 : 0
  const lossPct = n ? (losses / n) * 100 : 0
  const expPct = n ? (expired / n) * 100 : 0
  return (
    <div className="rounded-sm border border-line bg-wrap p-4">
      <div className="flex items-center justify-between mb-2">
        <EyebrowMono>Outcome distribution</EyebrowMono>
        <p className="text-[11px] text-d-text-muted">
          <span className="text-up">{wins} wins</span>
          {' · '}
          <span className="text-down">{losses} losses</span>
          {' · '}
          <span className="text-d-text-muted">{expired} expired</span>
        </p>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-wrap-hover">
        <div className="bg-up" style={{ width: `${winPct}%` }} />
        <div className="bg-down" style={{ width: `${lossPct}%` }} />
        <div className="bg-wrap-line" style={{ width: `${expPct}%` }} />
      </div>
    </div>
  )
}

/* ───────────────────────── PR 85 — per-engine breakdown ───────────────────────── */
//
// Each signal carries `engines: PublicModelKey[]` (which engines voted) and
// `result: 'target' | 'stop' | 'expired'`. The aggregate stats already
// answer "did the platform win" — the per-engine roll-up answers "which
// engines actually called the winners". Computed client-side from the
// signal list we're already showing; no extra API call.
//
// Win-rate denominator excludes 'expired' so an engine doesn't get
// punished by signals that simply ran out of time without resolving.

function EngineBreakdown({ signals }: { signals: TrackSignal[] }) {
  type Bucket = { engine: PublicModelKey; total: number; wins: number; losses: number; expired: number }
  const buckets: Record<string, Bucket> = {}
  for (const s of signals) {
    for (const e of s.engines || []) {
      if (!buckets[e]) buckets[e] = { engine: e, total: 0, wins: 0, losses: 0, expired: 0 }
      buckets[e].total++
      if (s.result === 'target') buckets[e].wins++
      else if (s.result === 'stop') buckets[e].losses++
      else buckets[e].expired++
    }
  }
  const rows = Object.values(buckets)
    .sort((a, b) => b.total - a.total || b.wins - a.wins)
  if (rows.length === 0) return null
  const maxTotal = Math.max(1, ...rows.map((r) => r.total))

  return (
    <div className="rounded-sm border border-line bg-wrap overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <EyebrowMono>Per-engine breakdown</EyebrowMono>
        <p className="text-[10px] text-d-text-muted">
          which engines called the {rows.length} active signals
        </p>
      </div>
      <div className="divide-y divide-line">
        {rows.map((r) => {
          const decided = r.wins + r.losses
          const wr = decided > 0 ? r.wins / decided : 0
          const wrTone: Tone = wr >= 0.55 ? 'up' : wr >= 0.45 ? 'warning' : 'down'
          const wrBar = wrTone === 'up' ? 'bg-up' : wrTone === 'warning' ? 'bg-warning' : 'bg-down'
          return (
            <div key={r.engine} className="px-4 py-2.5 flex items-center gap-3">
              <div className="shrink-0 w-32">
                <ModelBadge modelKey={r.engine} size="xs" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 text-[10px] text-d-text-muted">
                  <span>
                    <span className={`${MONO} text-d-text-primary`}>{r.total}</span>
                    {' signals · '}
                    <span className={`text-up ${MONO}`}>{r.wins}W</span>
                    {' · '}
                    <span className={`text-down ${MONO}`}>{r.losses}L</span>
                    {r.expired > 0 && (
                      <>
                        {' · '}
                        <span className={MONO}>{r.expired} exp</span>
                      </>
                    )}
                  </span>
                  <span className={`${MONO} font-medium ${TONE_TEXT[wrTone]}`}>
                    {decided > 0 ? `${(wr * 100).toFixed(0)}% WR` : 'no decisions yet'}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-wrap-hover overflow-hidden">
                  {/* Total share — light underlay */}
                  <div
                    className="absolute top-0 left-0 h-full bg-wrap-line"
                    style={{ width: `${(r.total / maxTotal) * 100}%` }}
                  />
                  {/* Win share — filled to WR pct of the total bar */}
                  <div
                    className={`absolute top-0 left-0 h-full ${wrBar}`}
                    style={{ width: `${(r.total / maxTotal) * 100 * wr}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-4 py-2 border-t border-line text-[10px] text-d-text-muted">
        Win rate excludes expired signals (no decision). One signal can be called by multiple engines —
        each engine claims credit when it voted for that signal.
      </div>
    </div>
  )
}


function Stat({
  label, value, sub, tone = 'neutral', numeric,
}: {
  label: string; value: string | number; sub?: string; tone?: Tone; numeric?: boolean
}) {
  return (
    <div className="rounded-sm border border-line bg-wrap p-4">
      <p className="font-mono text-[10px] text-d-text-muted uppercase tracking-[0.1em] mb-1">{label}</p>
      <p className={`${numeric ? MONO : ''} text-[20px] font-normal ${TONE_TEXT[tone]}`}>
        {value}
      </p>
      {sub && <p className={`${MONO} text-[11px] mt-1 text-d-text-muted`}>{sub}</p>}
    </div>
  )
}

function ButtonGroup<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T; options: Array<[T, string]>; onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-d-text-muted">{label}</span>
      <div className="inline-flex items-center bg-wrap border border-line rounded-sm p-0.5">
        {options.map(([v, display]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-3 py-1 text-[11px] font-medium rounded-sm transition-colors ${
              value === v ? 'bg-wrap-hover text-d-text-primary' : 'text-d-text-muted hover:text-d-text-primary'
            }`}
          >
            {display}
          </button>
        ))}
      </div>
    </div>
  )
}

// result → token class set (pill text + tint background).
function resultClasses(result: TrackSignal['result']): string {
  return result === 'target'
    ? 'text-up bg-up/10'
    : result === 'stop'
      ? 'text-down bg-down/10'
      : 'text-d-text-muted bg-wrap-hover'
}

function SignalRow({ row }: { row: TrackSignal }) {
  const isLong = row.direction === 'LONG'
  const engines = (row.engines || []).slice(0, 3)
  return (
    <tr className="border-b border-line last:border-0 hover:bg-hover transition-colors">
      <td className="px-4 py-3 text-d-text-primary font-medium">{row.symbol}</td>
      <td className="px-2 py-3">
        <span
          className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-sm ${
            isLong ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
          }`}
        >
          {isLong ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {row.direction}
        </span>
      </td>
      <td className={`px-2 py-3 text-right ${MONO} text-d-text-primary`}>₹{row.entry_price.toFixed(2)}</td>
      <td className={`px-2 py-3 text-right ${MONO} text-d-text-primary`}>₹{row.exit_price.toFixed(2)}</td>
      <td className={`px-2 py-3 text-right ${MONO} font-medium ${row.return_pct >= 0 ? 'text-up' : 'text-down'}`}>
        {row.return_pct >= 0 ? '+' : ''}{row.return_pct.toFixed(2)}%
      </td>
      <td className="px-2 py-3">
        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-sm uppercase tracking-wider ${resultClasses(row.result)}`}>
          {row.result}
        </span>
      </td>
      <td className="px-2 py-3">
        {engines.length ? (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {engines.map((k) => (
              <ModelBadge key={k} modelKey={k} size="xs" variant="soft" />
            ))}
          </div>
        ) : (
          <span className="text-d-text-muted text-[11px]">—</span>
        )}
      </td>
      <td className="px-2 py-3 text-d-text-muted text-[11px] capitalize">
        {row.regime_at_signal || '—'}
      </td>
      <td className={`px-4 py-3 text-right text-d-text-muted text-[11px] ${MONO}`}>
        {new Date(row.date).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short',
        })}
      </td>
    </tr>
  )
}

// PR 59 — mobile card layout. Same data, stacked for narrow screens.
function SignalCardMobile({ row }: { row: TrackSignal }) {
  const isLong = row.direction === 'LONG'
  const engines = (row.engines || []).slice(0, 3)
  return (
    <div className="rounded-sm border border-line bg-wrap p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold text-d-text-primary">{row.symbol}</span>
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                isLong ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
              }`}
            >
              {isLong ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {row.direction}
            </span>
            <span className={`inline-block px-1.5 py-0.5 text-[9px] font-medium rounded-sm uppercase tracking-wider ${resultClasses(row.result)}`}>
              {row.result}
            </span>
          </div>
          <div className={`text-[11px] text-d-text-muted mt-1 ${MONO}`}>
            {new Date(row.date).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
            {row.regime_at_signal ? ` · ${row.regime_at_signal}` : ''}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`${MONO} text-[15px] font-medium ${row.return_pct >= 0 ? 'text-up' : 'text-down'}`}>
            {row.return_pct >= 0 ? '+' : ''}{row.return_pct.toFixed(2)}%
          </div>
          <div className={`text-[10px] text-d-text-muted mt-0.5 ${MONO}`}>
            ₹{row.entry_price.toFixed(2)} → ₹{row.exit_price.toFixed(2)}
          </div>
        </div>
      </div>
      {engines.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-line">
          {engines.map((k) => (
            <ModelBadge key={k} modelKey={k} size="xs" variant="soft" />
          ))}
        </div>
      )}
    </div>
  )
}
