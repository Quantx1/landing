'use client'

/**
 * RegimePanel — body-only "Regime" panel for the /proof surface.
 *
 * Extracted verbatim from the retired /regime page (WP-CONSOLIDATE 3d).
 * Current-regime hero (large, tinted) + 90-day timeline + strategy-weight
 * table + explainer. No auth; no personalization.
 *
 * Body-only: no PublicHeader, no page wrapper — the /proof page shell
 * provides those and the tab chrome (and the Suspense boundary that the
 * `useSearchParams()` read below depends on).
 */

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowUpRight, Info, Loader2 } from '@/lib/icons'

import { api } from '@/lib/api'
import { MONO } from '@/lib/tokens'
import { EyebrowMono } from '@/components/foundation'
import MarketExplainerCard from '@/components/markets/MarketExplainerCard'

type Regime = 'bull' | 'sideways' | 'bear'

interface RegimeRow {
  regime: Regime
  prob_bull: number
  prob_sideways: number
  prob_bear: number
  vix: number | null
  nifty_close: number | null
  detected_at: string
}

// Theme-aware tone tokens. `tone` drives Tailwind utility classes (tri-theme
// safe); `cssVar` is for the inline SVG/timeline fills that need a raw value.
const REGIME_META: Record<
  Regime,
  { label: string; tone: 'up' | 'warning' | 'down'; cssVar: string; blurb: string }
> = {
  bull: {
    label: 'Bull',
    tone: 'up',
    cssVar: 'var(--color-up)',
    blurb: 'Trend + volume in sync with rising Nifty. AI signals run at full size.',
  },
  sideways: {
    label: 'Sideways',
    tone: 'warning',
    cssVar: 'var(--color-warning)',
    blurb: 'Range-bound price action. Mean-reversion favored; trend-following dampened.',
  },
  bear: {
    label: 'Bear',
    tone: 'down',
    cssVar: 'var(--color-down)',
    blurb: 'Structural breakdown. AI sizes reduced to 50%; long-only strategies down-weighted.',
  },
}

const TONE_TEXT: Record<'up' | 'warning' | 'down', string> = {
  up: 'text-up',
  warning: 'text-warning',
  down: 'text-down',
}
const TONE_TINT: Record<'up' | 'warning' | 'down', string> = {
  up: 'border-l-up bg-up/[0.06]',
  warning: 'border-l-warning bg-warning/[0.06]',
  down: 'border-l-down bg-down/[0.06]',
}

export default function RegimePanel() {
  const [state, setState] = useState<{
    current: RegimeRow | null
    history: RegimeRow[]
    counts: { bull: number; sideways: number; bear: number }
    loading: boolean
    error: string | null
  }>({
    current: null,
    history: [],
    counts: { bull: 0, sideways: 0, bear: 0 },
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.publicTrust.regimeHistory(90)
        if (!cancelled) {
          setState({
            current: (data.current as RegimeRow) || null,
            history: (data.history as RegimeRow[]) || [],
            counts: data.counts,
            loading: false,
            error: null,
          })
        }
      } catch (e: any) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: e?.message || 'Failed to load regime data' }))
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  const totalDays = state.counts.bull + state.counts.sideways + state.counts.bear
  // PR 127 — `?highlight=transitions` deep-links from the dashboard
  // turnover help. When set, the Timeline emphasizes regime-change
  // days so the user can see exactly *which* days flipped, not just
  // the count. Preserved verbatim through the /proof consolidation.
  const searchParams = useSearchParams()
  const highlightTransitions = searchParams?.get('highlight') === 'transitions'
  const current = state.current
  const currentMeta = current ? REGIME_META[current.regime] : null

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <EyebrowMono className="mb-2">Market regime detector</EyebrowMono>
        <h1 className="heading-display text-[28px] md:text-[34px] font-normal text-d-text-primary">
          Market regime
        </h1>
        <p className="text-[13px] text-d-text-secondary mt-2 max-w-2xl">
          <span className="text-d-text-primary font-medium">Regime</span> reads Nifty + India VIX every
          morning at <span className={`${MONO} text-d-text-primary`}>08:15 IST</span> and tells every signal
          downstream what regime sizing to apply.
        </p>
      </div>

      {state.loading ? (
        <div className="rounded-sm border border-line bg-wrap flex items-center justify-center min-h-[120px]">
          <Loader2 className="w-5 h-5 text-d-text-muted animate-spin" />
        </div>
      ) : state.error ? (
        <div className="rounded-sm border border-down/40 bg-down/[0.06] p-4 text-down text-[12px]">{state.error}</div>
      ) : current && currentMeta ? (
        <>
          {/* Current-regime hero */}
          <div
            className={`rounded-sm border border-line bg-wrap border-l-2 p-6 flex flex-col md:flex-row items-start md:items-center gap-5 ${TONE_TINT[currentMeta.tone]}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`heading-display text-[32px] font-normal ${TONE_TEXT[currentMeta.tone]}`}>
                  {currentMeta.label}
                </span>
                <span className="text-[13px] text-d-text-muted">
                  · conf{' '}
                  <span className={`${MONO} text-d-text-primary`}>
                    {Math.round((current[`prob_${current.regime}` as keyof RegimeRow] as number) * 100)}%
                  </span>
                </span>
              </div>
              <p className="text-[13px] text-d-text-secondary max-w-2xl">{currentMeta.blurb}</p>
              <p className="text-[11px] text-d-text-muted mt-2">
                As of{' '}
                <span className={`${MONO} text-d-text-primary`}>
                  {new Date(current.detected_at).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                {current.vix !== null && (
                  <> · VIX <span className={`${MONO} text-d-text-primary`}>{current.vix.toFixed(2)}</span></>
                )}
                {current.nifty_close !== null && (
                  <> · Nifty <span className={`${MONO} text-d-text-primary`}>{current.nifty_close.toLocaleString('en-IN')}</span></>
                )}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 shrink-0 min-w-[280px]">
              <ProbabilityChip label="Bull" value={current.prob_bull} tone="up" />
              <ProbabilityChip label="Side." value={current.prob_sideways} tone="warning" />
              <ProbabilityChip label="Bear" value={current.prob_bear} tone="down" />
            </div>
          </div>

          {/* Timeline — horizontal bar sized by counts */}
          <div className="rounded-sm border border-line bg-wrap p-4">
            <div className="flex items-center justify-between mb-3">
              <EyebrowMono>90-day regime timeline</EyebrowMono>
              <span className="text-[11px] text-d-text-muted">
                <span className={`${MONO} text-d-text-primary`}>{state.history.length}</span> daily samples
              </span>
            </div>
            <Timeline history={state.history} highlightTransitions={highlightTransitions} />
            {totalDays > 0 && (
              <div className="flex gap-4 mt-4 text-[11px]">
                <Legend label="Bull" value={state.counts.bull} total={totalDays} tone="up" />
                <Legend label="Sideways" value={state.counts.sideways} total={totalDays} tone="warning" />
                <Legend label="Bear" value={state.counts.bear} total={totalDays} tone="down" />
              </div>
            )}
          </div>

          {/* Regime-vs-pipeline table */}
          <div className="rounded-sm border border-line bg-wrap p-4">
            <EyebrowMono className="mb-3">How regime shapes signal generation</EyebrowMono>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="text-d-text-muted">
                  <tr className="border-b border-line">
                    <th className="text-left py-2 font-normal">Regime</th>
                    <th className="text-right py-2 font-normal">Engine agreement</th>
                    <th className="text-right py-2 font-normal">Confidence</th>
                    <th className="text-right py-2 font-normal">Position size</th>
                    <th className="text-right py-2 font-normal">Long bias</th>
                  </tr>
                </thead>
                <tbody className={MONO}>
                  <WeightRow regime="bull"     values={['Majority',  'Full', 'Full', 'full']} />
                  <WeightRow regime="sideways" values={['Majority',  'Full', 'Full', 'full']} />
                  <WeightRow regime="bear"     values={['Unanimous', 'Reduced', 'Reduced',  'gated']} />
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-d-text-muted mt-3 flex items-start gap-1.5">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              In bear regimes Regime votes against every long signal, so it takes unanimous
              agreement to override. We also reduce confidence and position sizes.
              {' '}See <Link href="/proof?tab=models" className="text-d-text-primary underline underline-offset-2 hover:text-primary">live model accuracy</Link>.
            </p>
          </div>

          {/* AIL v2 P3 — AI Market Explainer (regime is one of its grounded facts; honest-empty) */}
          <MarketExplainerCard />

          {/* Explainer */}
          <div className="rounded-sm border border-line bg-wrap p-4 space-y-3 text-[13px] leading-relaxed text-d-text-secondary">
            <EyebrowMono>How Regime works</EyebrowMono>
            <p>
              Regime reads Nifty and India VIX every day and maps the market to one of three
              states: <span className="text-d-text-primary">bull</span>,
              {' '}<span className="text-d-text-primary">sideways</span>, or{' '}
              <span className="text-d-text-primary">bear</span>.
            </p>
            <p>
              Every morning at <span className={`${MONO} text-d-text-primary`}>08:15 IST</span>,
              before the open, Regime re-runs and updates. Position sizes and confidence gates
              flip the moment the state changes, not on the next candle, not the next day.
            </p>
            <p>
              Inside the signal pipeline, Regime is one of several named engines that must agree
              before a signal ships, alongside <span className="text-d-text-primary">Alpha</span> and
              others. Each scores every candidate independently, and a majority has to concur.
              {' '}<span className="text-d-text-primary">Mood</span> (NSE news sentiment) runs as a
              separate on-demand engine; it informs your read on a name but does not vote in the
              signal ensemble. No signal ships from heuristics; every emitted signal is real
              model agreement.
            </p>
            <p>
              <Link href="/proof?tab=track-record" className="text-d-text-primary underline underline-offset-2 hover:text-primary inline-flex items-center gap-1">
                See every closed signal with realized P&L
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-sm border border-line bg-wrap p-4 text-[12px] text-d-text-muted">
          No regime data captured yet. First snapshot lands at the next 08:15 IST run.
        </div>
      )}

      <p className="text-[10px] text-d-text-muted pt-6 border-t border-line">
        Past regime performance is not predictive of future market behavior. Market
        investments carry risk.
      </p>
    </div>
  )
}

// ------------------------------------------------------------- subcomponents

function ProbabilityChip({ label, value, tone }: { label: string; value: number; tone: 'up' | 'warning' | 'down' }) {
  const borderTone = tone === 'up' ? 'border-l-up' : tone === 'warning' ? 'border-l-warning' : 'border-l-down'
  return (
    <div className={`rounded-sm border border-line bg-wrap border-l-2 ${borderTone} p-3 text-center`}>
      <div className={`${MONO} text-[16px] font-normal ${TONE_TEXT[tone]}`}>
        {Math.round(value * 100)}%
      </div>
      <div className="font-mono text-[10px] text-d-text-muted uppercase tracking-[0.1em] mt-0.5">
        {label}
      </div>
    </div>
  )
}

function Timeline({ history, highlightTransitions }: { history: RegimeRow[]; highlightTransitions?: boolean }) {
  if (!history.length) {
    return <div className="h-12 rounded-sm bg-wrap-hover" />
  }
  return (
    <div className="flex gap-[1px] h-12 rounded-sm overflow-hidden">
      {history.map((row, i) => {
        // PR 127 — when deep-linked with `?highlight=transitions`, dim
        // non-transition days and ring the change days so the eye
        // lands on exactly the cells that flipped.
        const changed = i > 0 && history[i - 1].regime !== row.regime
        const dimmed = highlightTransitions && !changed
        return (
          <div
            key={i}
            className="relative flex-1 min-w-[3px] transition-opacity hover:opacity-80"
            title={
              (changed ? '↳ regime change · ' : '') +
              `${row.detected_at.slice(0, 10)} · ${row.regime}`
            }
            style={{
              backgroundColor: REGIME_META[row.regime].cssVar,
              opacity: dimmed ? 0.25 : 1,
            }}
          >
            {highlightTransitions && changed && (
              <span className="absolute inset-y-0 left-0 w-[2px] bg-d-text-primary/95" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Legend({ label, value, total, tone }: {
  label: string; value: number; total: number; tone: 'up' | 'warning' | 'down'
}) {
  const dotTone = tone === 'up' ? 'bg-up' : tone === 'warning' ? 'bg-warning' : 'bg-down'
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${dotTone}`} />
      <span className="text-d-text-secondary">{label}</span>
      <span className={`${MONO} text-d-text-primary`}>{value}d</span>
      <span className="text-d-text-muted">({((value / total) * 100).toFixed(0)}%)</span>
    </span>
  )
}

function WeightRow({ regime, values }: { regime: Regime; values: string[] }) {
  const meta = REGIME_META[regime]
  const pillTone =
    meta.tone === 'up' ? 'text-up bg-up/10' : meta.tone === 'warning' ? 'text-warning bg-warning/10' : 'text-down bg-down/10'
  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-2.5">
        <span className={`inline-block px-2 py-0.5 rounded-sm text-[11px] font-medium capitalize ${pillTone}`}>
          {meta.label}
        </span>
      </td>
      {values.map((v, i) => (
        <td key={i} className="text-right py-2.5 text-d-text-primary">{v}</td>
      ))}
    </tr>
  )
}
