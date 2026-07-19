'use client'

/**
 * ModelsPanel — body-only "Engine accuracy" panel for the /proof surface.
 *
 * Extracted verbatim from the retired /models page (WP-CONSOLIDATE 3d).
 * Grid of ModelAccuracyCards + 7/30/90/365 window selector. One card per
 * engine in the Quant X stack. Feeds from ``model_rolling_performance``
 * written weekly by the scheduler aggregator job (PR 7).
 *
 * Body-only: no PublicHeader, no page wrapper — the /proof page shell
 * provides those and the tab chrome.
 */

import { useEffect, useState } from 'react'
import { Loader2 } from '@/lib/icons'

import { api } from '@/lib/api'
import { MONO } from '@/lib/tokens'
import { EyebrowMono } from '@/components/foundation'
import ModelAccuracyCard from '@/components/signals/ModelAccuracyCard'

export default function ModelsPanel() {
  const [windowDays, setWindowDays] = useState<7 | 30 | 90 | 365>(30)
  const [models, setModels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const res = await api.publicTrust.models(windowDays)
        if (!cancelled) {
          setModels(res.models || [])
          setError(null)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load model data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [windowDays])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <EyebrowMono className="mb-2">Live model accuracy</EyebrowMono>
        <h1 className="heading-display text-[28px] md:text-[34px] font-normal text-d-text-primary">
          Model accuracy
        </h1>
        <p className="text-[13px] text-d-text-secondary mt-2 max-w-3xl">
          Every engine in the Quant X stack is measured against its own closed signals and
          re-evaluated weekly. Win rate = fraction of closed signals that hit their target before
          their stop. Figures below update every Sunday at{' '}
          <span className={`${MONO} text-d-text-primary`}>02:00 IST</span>.
        </p>
      </div>

      {/* Window selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-d-text-muted">Window</span>
        <div className="inline-flex items-center bg-wrap border border-line rounded-sm p-0.5">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setWindowDays(d as 7 | 30 | 90 | 365)}
              className={`px-3 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                windowDays === d ? 'bg-wrap-hover text-d-text-primary' : 'text-d-text-muted hover:text-d-text-primary'
              }`}
            >
              {d === 365 ? '1y' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-sm border border-line bg-wrap flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-5 h-5 text-d-text-muted animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-sm border border-down/40 bg-down/[0.06] p-4 text-down text-[12px]">{error}</div>
      ) : models.length === 0 ? (
        <div className="rounded-sm border border-line bg-wrap text-center py-10">
          <p className="text-d-text-primary">No model performance data yet for this window.</p>
          <p className="text-[12px] text-d-text-muted mt-1">
            First aggregate run fires Sunday 02:00 IST after we have enough closed signals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => (
            <ModelAccuracyCard
              key={m.model_name}
              modelName={m.model_name}
              windowDays={m.window_days}
              winRate={m.win_rate}
              signalCount={m.signal_count || 0}
              avgPnlPct={m.avg_pnl_pct}
              sharpeRatio={m.sharpe_ratio}
              computedAt={m.computed_at}
              sparkline={m.sparkline || []}
              status={m.is_prod ? 'prod' : (m.is_shadow ? 'shadow' : guessStatus(m.model_name))}
              primaryMetric={m.primary_metric}
              primaryValue={m.primary_value}
              primaryLabel={m.primary_label}
              source={m.source}
            />
          ))}
        </div>
      )}

      {/* Explainer */}
      <div className="rounded-sm border border-line bg-wrap p-4 space-y-3 text-[13px] leading-relaxed text-d-text-secondary mt-4">
        <EyebrowMono>How we measure accuracy</EyebrowMono>
        <p>
          For every closed signal we record whether it hit target, stop loss, or expired. &ldquo;Win
          rate&rdquo; is the fraction that hit target. &ldquo;Directional accuracy&rdquo; equals win rate for
          binary long/short calls. Rolling windows of{' '}
          <span className={`${MONO} text-d-text-primary`}>7 / 30 / 90 / 365 days</span> are recomputed every
          week from the live trade ledger.
        </p>
        <p>
          <strong className="text-d-text-primary">PROD</strong> tag = the model ships into signals users see.
          <strong className="text-warning ml-2">SHADOW</strong> tag = the model writes predictions
          alongside live signals for A/B audit but does <em>not</em> shape user-facing confidence.
          Promotion to prod requires passing our regression gate.
        </p>
        <p>
          Signals ship only when several named engines agree, never from a single model. Mood
          (news sentiment) runs as a separate on-demand engine and is shown here for transparency;
          it does not vote in the signal ensemble.
        </p>
        <p className="text-[11px] text-d-text-muted">
          The PROD/SHADOW labels reflect each model&apos;s live state in our registry.
          Source of truth, not marketing.
        </p>
      </div>

      <p className="text-[10px] text-d-text-muted pt-6 border-t border-line">
        Past model performance is not predictive of future accuracy. Models retrain monthly
        (weekly for the regime detector); results shift over time.
      </p>
    </div>
  )
}

// ----------------------------------------------------------------- helpers

/**
 * Best-effort status guess until the backend surfaces
 * is_prod / is_shadow on the model_rolling_performance payload.
 * Per the locked no-fallbacks ensemble, the four signal voters are
 * PROD: Forecast (TFT), Gate (LGBM gate), Alpha (Qlib), Regime (HMM)
 * — at least three of four must agree. Mood (FinBERT) is also PROD
 * but runs as a standalone on-demand sentiment engine, not as a fifth
 * voter in the signal ensemble. Everything else (intraday LSTM, VIX
 * TFT, earnings model, etc.) is staged in shadow until its first
 * is_prod promotion lands in model_versions.
 */
function guessStatus(modelName: string): 'prod' | 'shadow' {
  // Authoritative status comes from model_versions.is_prod via the
  // backend payload. This local set is a UI fallback while the backend
  // is being upgraded to surface is_prod directly per row.
  // v1 PROD set (locked 2026-05-17). Dropped from v1: momentum_chronos /
  // options_rl / vix_tft / chronos2_macro — any row from those that
  // appears here falls through to 'shadow' which is the safe default.
  const PROD = new Set([
    'regime_hmm',
    'tft_swing',
    'lgbm_signal_gate',
    'qlib_alpha158',
    'finbert_india',
  ])
  return PROD.has(modelName) ? 'prod' : 'shadow'
}
