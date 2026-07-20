'use client'

import { useMemo, useState } from 'react'
import { NumericInput } from '@/components/foundation'
import { calcSip, calcLumpsum, calcCagr, calcRequiredSip, calcRealValue } from '@/lib/tools/calc'
import {
  ToolLayout, ResultPanel, ResultHeadline, ResultRow, ResultGroup,
  inr, inrCompact, pct,
} from '../ToolShell'

const n = (v: number | null) => v ?? 0

/** Shared invested-vs-gains split bar. */
function SplitBar({ invested, gains }: { invested: number; gains: number }) {
  const total = invested + gains
  const investedPct = total > 0 ? (invested / total) * 100 : 0
  return (
    <div className="px-5 py-4">
      <div className="flex h-2 overflow-hidden rounded-pill bg-wrap-hover">
        <div className="bg-d-text-muted" style={{ width: `${investedPct}%` }} />
        <div className="bg-up" style={{ width: `${100 - investedPct}%` }} />
      </div>
      <div className="mt-2.5 flex justify-between text-[11px] text-d-text-muted">
        <span>Invested {investedPct.toFixed(0)}%</span>
        <span>Returns {(100 - investedPct).toFixed(0)}%</span>
      </div>
    </div>
  )
}

/* ───────────────────────────── SIP ───────────────────────────── */

export function SipCalculator() {
  const [monthly, setMonthly] = useState<number | null>(10000)
  const [rate, setRate] = useState<number | null>(12)
  const [years, setYears] = useState<number | null>(10)

  const r = useMemo(() => calcSip(n(monthly), n(rate), n(years)), [monthly, rate, years])

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Monthly investment" value={monthly} onChange={setMonthly} min={0} formatter="currency-inr" />
          <NumericInput
            label="Expected return"
            value={rate}
            onChange={setRate}
            min={0}
            max={50}
            step={0.5}
            formatter="percent"
            helper="Per year. Indian equity has historically run 11–13% over long periods."
          />
          <NumericInput label="Tenure (years)" value={years} onChange={setYears} min={0} max={50} formatter="integer" />
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Maturity value" value={inrCompact(r.futureValue)} tone="up" hint={inr(r.futureValue, 0)} />
          <SplitBar invested={r.invested} gains={r.gains} />
          <ResultGroup>
            <ResultRow label="Total invested" value={inr(r.invested, 0)} />
            <ResultRow label="Estimated returns" value={inr(r.gains, 0)} tone="up" />
            <ResultRow label="Absolute return" value={pct(r.absoluteReturnPercent, 1)} strong />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ─────────────────────────── lumpsum ─────────────────────────── */

export function LumpsumCalculator() {
  const [principal, setPrincipal] = useState<number | null>(500000)
  const [rate, setRate] = useState<number | null>(12)
  const [years, setYears] = useState<number | null>(10)
  const [inflation, setInflation] = useState<number | null>(5)

  const r = useMemo(() => calcLumpsum(n(principal), n(rate), n(years)), [principal, rate, years])
  const real = useMemo(
    () => calcRealValue(r.futureValue, n(inflation), n(years)),
    [r.futureValue, inflation, years],
  )

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Investment amount" value={principal} onChange={setPrincipal} min={0} formatter="currency-inr" />
          <NumericInput label="Expected return" value={rate} onChange={setRate} min={0} max={50} step={0.5} formatter="percent" />
          <NumericInput label="Tenure (years)" value={years} onChange={setYears} min={0} max={50} formatter="integer" />
          <NumericInput
            label="Inflation (optional)"
            value={inflation}
            onChange={setInflation}
            min={0}
            max={30}
            step={0.5}
            formatter="percent"
            helper="Used to show what the corpus is worth in today’s rupees."
          />
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Future value" value={inrCompact(r.futureValue)} tone="up" hint={inr(r.futureValue, 0)} />
          <SplitBar invested={r.invested} gains={r.gains} />
          <ResultGroup>
            <ResultRow label="Invested" value={inr(r.invested, 0)} />
            <ResultRow label="Returns" value={inr(r.gains, 0)} tone="up" />
            <ResultRow label="Absolute return" value={pct(r.absoluteReturnPercent, 1)} strong />
          </ResultGroup>
          <ResultGroup title="In today’s money">
            <ResultRow label="Inflation-adjusted" value={inrCompact(real)} hint={`at ${pct(n(inflation), 1)}`} />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ──────────────────────────── CAGR ───────────────────────────── */

export function CagrCalculator() {
  const [initial, setInitial] = useState<number | null>(100000)
  const [final, setFinal] = useState<number | null>(250000)
  const [years, setYears] = useState<number | null>(5)

  const cagr = useMemo(() => calcCagr(n(initial), n(final), n(years)), [initial, final, years])
  const absolute = n(initial) > 0 ? ((n(final) - n(initial)) / n(initial)) * 100 : 0

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Initial value" value={initial} onChange={setInitial} min={0} formatter="currency-inr" />
          <NumericInput label="Final value" value={final} onChange={setFinal} min={0} formatter="currency-inr" />
          <NumericInput label="Period (years)" value={years} onChange={setYears} min={0} max={60} step={0.5} />
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label="CAGR"
            value={pct(cagr)}
            tone={cagr > 0 ? 'up' : cagr < 0 ? 'down' : 'neutral'}
            hint={`Over ${n(years)} year${n(years) === 1 ? '' : 's'}`}
          />
          <ResultGroup>
            <ResultRow label="Absolute gain" value={inr(n(final) - n(initial), 0)} tone={n(final) >= n(initial) ? 'up' : 'down'} />
            <ResultRow label="Absolute return" value={pct(absolute, 1)} />
            <ResultRow label="Multiple" value={`${(n(initial) > 0 ? n(final) / n(initial) : 0).toFixed(2)}×`} strong />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ─────────────────────── goal-based SIP ──────────────────────── */

export function GoalSipCalculator() {
  const [target, setTarget] = useState<number | null>(10000000)
  const [rate, setRate] = useState<number | null>(12)
  const [years, setYears] = useState<number | null>(15)

  const monthly = useMemo(() => calcRequiredSip(n(target), n(rate), n(years)), [target, rate, years])
  const check = useMemo(() => calcSip(monthly, n(rate), n(years)), [monthly, rate, years])

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Target corpus" value={target} onChange={setTarget} min={0} formatter="currency-inr" />
          <NumericInput label="Expected return" value={rate} onChange={setRate} min={0} max={50} step={0.5} formatter="percent" />
          <NumericInput
            label="Years to goal"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            formatter="integer"
            helper="Extending the horizon lowers the required SIP faster than any other lever."
          />
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Monthly SIP needed" value={inr(monthly, 0)} hint={`To reach ${inrCompact(n(target))}`} />
          <ResultGroup>
            <ResultRow label="Total contributed" value={inr(check.invested, 0)} />
            <ResultRow label="Growth" value={inr(check.gains, 0)} tone="up" />
            <ResultRow label="Projected corpus" value={inrCompact(check.futureValue)} strong tone="up" />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}
