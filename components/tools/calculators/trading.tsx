'use client'

import { useMemo, useState } from 'react'
import { NumericInput, Segmented, Badge } from '@/components/foundation'
import {
  calcBrokerage, calcPositionSize, calcRiskReward,
  calcPivotsClassic, calcPivotsFibonacci,
} from '@/lib/tools/calc'
import { SEGMENTS, type Segment } from '@/lib/tools/rates'
import {
  ToolLayout, ResultPanel, ResultHeadline, ResultRow, ResultGroup, inr, pct, num,
} from '../ToolShell'

const n = (v: number | null) => v ?? 0

/* ───────────────────── brokerage & charges ───────────────────── */

export function BrokerageCalculator() {
  const [segment, setSegment] = useState<Segment>('delivery')
  const [buyPrice, setBuyPrice] = useState<number | null>(1000)
  const [sellPrice, setSellPrice] = useState<number | null>(1050)
  const [quantity, setQuantity] = useState<number | null>(100)
  const [brokerageOverride, setBrokerageOverride] = useState<number | null>(null)

  const r = useMemo(
    () =>
      calcBrokerage({
        segment,
        buyPrice: n(buyPrice),
        sellPrice: n(sellPrice),
        quantity: n(quantity),
        brokerageOverride: brokerageOverride ?? undefined,
      }),
    [segment, buyPrice, sellPrice, quantity, brokerageOverride],
  )

  return (
    <ToolLayout
      inputs={
        <>
          <Segmented<Segment>
            value={segment}
            onChange={setSegment}
            options={(Object.keys(SEGMENTS) as Segment[]).map((s) => ({
              value: s,
              label: SEGMENTS[s].label.replace('Equity ', ''),
            }))}
          />
          <p className="text-xs leading-relaxed text-d-text-muted">{SEGMENTS[segment].notes}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Buy price" value={buyPrice} onChange={setBuyPrice} min={0} formatter="currency-inr" />
            <NumericInput label="Sell price" value={sellPrice} onChange={setSellPrice} min={0} formatter="currency-inr" />
          </div>
          <NumericInput label="Quantity" value={quantity} onChange={setQuantity} min={0} formatter="integer" />
          <NumericInput
            label="Brokerage per order (optional)"
            value={brokerageOverride}
            onChange={setBrokerageOverride}
            min={0}
            formatter="currency-inr"
            helper="Leave blank to use the discount-broker default for this segment."
          />
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label="Net P&L after charges"
            value={inr(r.netPnl)}
            tone={r.netPnl > 0 ? 'up' : r.netPnl < 0 ? 'down' : 'neutral'}
            hint={`Break-even move: ${inr(r.breakevenPoints)} per share`}
          />
          <ResultGroup title="Trade">
            <ResultRow label="Turnover" value={inr(r.turnover)} />
            <ResultRow label="Gross P&L" value={inr(r.grossPnl)} tone={r.grossPnl >= 0 ? 'up' : 'down'} />
          </ResultGroup>
          <ResultGroup title="Charges">
            <ResultRow label="Brokerage" value={inr(r.brokerage)} />
            <ResultRow label="STT" value={inr(r.stt)} />
            <ResultRow label="Exchange txn" value={inr(r.exchangeTxn)} />
            <ResultRow label="SEBI turnover" value={inr(r.sebi)} />
            <ResultRow label="Stamp duty" value={inr(r.stampDuty)} />
            <ResultRow label="GST" value={inr(r.gst)} hint="18%" />
            {r.dpCharge > 0 && <ResultRow label="DP charge" value={inr(r.dpCharge)} hint="incl. GST" />}
            <ResultRow label="Total charges" value={inr(r.totalCharges)} strong tone="down" />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ───────────────────────── position size ─────────────────────── */

export function PositionSizeCalculator() {
  const [capital, setCapital] = useState<number | null>(500000)
  const [riskPercent, setRiskPercent] = useState<number | null>(2)
  const [entry, setEntry] = useState<number | null>(1000)
  const [stopLoss, setStopLoss] = useState<number | null>(960)

  const r = useMemo(
    () =>
      calcPositionSize({
        capital: n(capital),
        riskPercent: n(riskPercent),
        entry: n(entry),
        stopLoss: n(stopLoss),
      }),
    [capital, riskPercent, entry, stopLoss],
  )

  const overCapital = r.positionValue > n(capital)

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Total capital" value={capital} onChange={setCapital} min={0} formatter="currency-inr" />
          <NumericInput
            label="Risk per trade"
            value={riskPercent}
            onChange={setRiskPercent}
            min={0}
            max={100}
            step={0.25}
            formatter="percent"
            helper="1–2% is the conventional range."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Entry price" value={entry} onChange={setEntry} min={0} formatter="currency-inr" />
            <NumericInput label="Stop loss" value={stopLoss} onChange={setStopLoss} min={0} formatter="currency-inr" />
          </div>
          {r.quantity === 0 && n(entry) > 0 && (
            <p className="text-xs leading-relaxed text-warning">
              Stop is too far from entry for this risk budget — the position rounds down to zero shares.
            </p>
          )}
          {overCapital && (
            <p className="text-xs leading-relaxed text-warning">
              This position exceeds your capital. The stop is very tight; on delivery you cannot take it.
            </p>
          )}
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Shares to buy" value={num(r.quantity)} hint={`Risking ${inr(r.riskAmount)}`} />
          <ResultGroup>
            <ResultRow label="Risk amount" value={inr(r.riskAmount)} />
            <ResultRow label="Risk per share" value={inr(r.riskPerShare)} />
            <ResultRow label="Stop distance" value={pct(r.stopDistancePercent)} />
          </ResultGroup>
          <ResultGroup title="Position">
            <ResultRow label="Position value" value={inr(r.positionValue)} strong />
            <ResultRow label="% of capital" value={pct(r.positionPercentOfCapital)} />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ───────────────────────── risk / reward ─────────────────────── */

export function RiskRewardCalculator() {
  const [entry, setEntry] = useState<number | null>(1000)
  const [stopLoss, setStopLoss] = useState<number | null>(960)
  const [target, setTarget] = useState<number | null>(1120)

  const r = useMemo(
    () => calcRiskReward(n(entry), n(stopLoss), n(target)),
    [entry, stopLoss, target],
  )

  const quality = r.ratio >= 3 ? 'up' : r.ratio >= 1.5 ? 'neutral' : 'down'

  return (
    <ToolLayout
      inputs={
        <>
          <NumericInput label="Entry price" value={entry} onChange={setEntry} min={0} formatter="currency-inr" />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Stop loss" value={stopLoss} onChange={setStopLoss} min={0} formatter="currency-inr" />
            <NumericInput label="Target" value={target} onChange={setTarget} min={0} formatter="currency-inr" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Badge tone={quality === 'up' ? 'up' : quality === 'down' ? 'down' : 'muted'}>
              {r.ratio >= 3 ? 'Favourable' : r.ratio >= 1.5 ? 'Acceptable' : 'Poor'}
            </Badge>
            <span className="text-xs text-d-text-muted">
              Needs a {pct(r.breakevenWinRatePercent, 1)} win rate to break even.
            </span>
          </div>
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label="Risk : reward"
            value={`1 : ${r.ratio.toFixed(2)}`}
            tone={quality === 'up' ? 'up' : quality === 'down' ? 'down' : 'neutral'}
            hint={`Break-even win rate ${pct(r.breakevenWinRatePercent, 1)}`}
          />
          <ResultGroup title="Per share">
            <ResultRow label="Risk" value={inr(r.risk)} tone="down" />
            <ResultRow label="Reward" value={inr(r.reward)} tone="up" />
          </ResultGroup>
          <ResultGroup title="As % of entry">
            <ResultRow label="Downside" value={pct(r.riskPercent)} tone="down" />
            <ResultRow label="Upside" value={pct(r.rewardPercent)} tone="up" />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ───────────────────────── pivot points ──────────────────────── */

export function PivotPointCalculator() {
  const [method, setMethod] = useState<'classic' | 'fibonacci'>('classic')
  const [high, setHigh] = useState<number | null>(1050)
  const [low, setLow] = useState<number | null>(980)
  const [close, setClose] = useState<number | null>(1020)

  const p = useMemo(
    () =>
      method === 'classic'
        ? calcPivotsClassic(n(high), n(low), n(close))
        : calcPivotsFibonacci(n(high), n(low), n(close)),
    [method, high, low, close],
  )

  const invalid = n(high) < n(low)

  return (
    <ToolLayout
      inputs={
        <>
          <Segmented<'classic' | 'fibonacci'>
            value={method}
            onChange={setMethod}
            options={[
              { value: 'classic', label: 'Classic' },
              { value: 'fibonacci', label: 'Fibonacci' },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumericInput label="High" value={high} onChange={setHigh} min={0} formatter="currency-inr" />
            <NumericInput label="Low" value={low} onChange={setLow} min={0} formatter="currency-inr" />
            <NumericInput label="Close" value={close} onChange={setClose} min={0} formatter="currency-inr" />
          </div>
          {invalid && (
            <p className="text-xs text-warning">High is below low — check the inputs.</p>
          )}
          <p className="text-xs leading-relaxed text-d-text-muted">
            Use the previous session’s range. All three values must come from the same timeframe.
          </p>
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Pivot" value={inr(p.pivot)} hint={method === 'classic' ? 'Classic method' : 'Fibonacci method'} />
          <ResultGroup title="Resistance">
            <ResultRow label="R3" value={inr(p.r3)} tone="up" />
            <ResultRow label="R2" value={inr(p.r2)} tone="up" />
            <ResultRow label="R1" value={inr(p.r1)} tone="up" />
          </ResultGroup>
          <ResultGroup title="Support">
            <ResultRow label="S1" value={inr(p.s1)} tone="down" />
            <ResultRow label="S2" value={inr(p.s2)} tone="down" />
            <ResultRow label="S3" value={inr(p.s3)} tone="down" />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}
