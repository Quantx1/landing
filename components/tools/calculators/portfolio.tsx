'use client'

import { useMemo, useState } from 'react'
import { NumericInput, Button, Badge } from '@/components/foundation'
import { Plus, Trash2 } from '@/lib/icons'
import { calcAveragePrice, calcMargin, calcPnl, calcCapitalGains, type Lot } from '@/lib/tools/calc'
import { CAPITAL_GAINS } from '@/lib/tools/rates'
import {
  ToolLayout, ResultPanel, ResultHeadline, ResultRow, ResultGroup, inr, pct, num,
} from '../ToolShell'

const n = (v: number | null) => v ?? 0

/* ─────────────────────── average price ───────────────────────── */

export function AveragePriceCalculator() {
  const [lots, setLots] = useState<{ price: number | null; quantity: number | null }[]>([
    { price: 1000, quantity: 50 },
    { price: 900, quantity: 50 },
  ])

  const parsed: Lot[] = lots.map((l) => ({ price: n(l.price), quantity: n(l.quantity) }))
  const r = useMemo(() => calcAveragePrice(parsed), [lots]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (i: number, field: 'price' | 'quantity', v: number | null) =>
    setLots((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: v } : l)))

  return (
    <ToolLayout
      inputs={
        <>
          <div className="space-y-3">
            {lots.map((lot, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <NumericInput
                    label={i === 0 ? 'Buy price' : undefined}
                    value={lot.price}
                    onChange={(v) => update(i, 'price', v)}
                    min={0}
                    size="sm"
                    formatter="currency-inr"
                  />
                  <NumericInput
                    label={i === 0 ? 'Quantity' : undefined}
                    value={lot.quantity}
                    onChange={(v) => update(i, 'quantity', v)}
                    min={0}
                    size="sm"
                    formatter="integer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLots((p) => p.filter((_, idx) => idx !== i))}
                  disabled={lots.length <= 1}
                  aria-label={`Remove purchase ${i + 1}`}
                  className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line text-d-text-muted transition hover:border-wrap-line hover:text-d-text-primary disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => setLots((p) => [...p, { price: null, quantity: null }])}
          >
            <Plus size={14} />
            Add purchase
          </Button>
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline label="Average price" value={inr(r.averagePrice)} hint={`${num(r.totalQuantity)} shares`} />
          <ResultGroup>
            <ResultRow label="Total quantity" value={num(r.totalQuantity)} />
            <ResultRow label="Total invested" value={inr(r.totalInvested, 0)} strong />
            <ResultRow label="Purchases" value={num(lots.length)} />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ───────────────────────────  margin  ────────────────────────── */

export function MarginCalculator() {
  const [price, setPrice] = useState<number | null>(1000)
  const [quantity, setQuantity] = useState<number | null>(100)
  const [leverage, setLeverage] = useState<number | null>(5)

  const r = useMemo(() => calcMargin(n(price), n(quantity), n(leverage)), [price, quantity, leverage])
  const wipeoutMove = r.leverage > 0 ? 100 / r.leverage : 0

  return (
    <ToolLayout
      inputs={
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Price" value={price} onChange={setPrice} min={0} formatter="currency-inr" />
            <NumericInput label="Quantity" value={quantity} onChange={setQuantity} min={0} formatter="integer" />
          </div>
          <NumericInput
            label="Leverage"
            value={leverage}
            onChange={setLeverage}
            min={1}
            max={50}
            step={0.5}
            formatter="multiplier"
            helper="Intraday equity is capped near 5× under SEBI peak-margin rules. Delivery is 1×."
          />
          {r.leverage > 5 && (
            <p className="text-xs leading-relaxed text-warning">
              Above 5× is not available for intraday equity in India — this range applies to derivatives only.
            </p>
          )}
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label="Margin required"
            value={inr(r.marginRequired, 0)}
            hint={`Controls ${inr(r.positionValue, 0)}`}
          />
          <ResultGroup>
            <ResultRow label="Position value" value={inr(r.positionValue, 0)} />
            <ResultRow label="Leverage" value={`${r.leverage}×`} />
            <ResultRow label="Capital at risk" value={inr(r.marginRequired, 0)} strong />
          </ResultGroup>
          <ResultGroup title="Wipeout threshold">
            <ResultRow
              label="Adverse move to lose margin"
              value={pct(wipeoutMove, 1)}
              tone="down"
              strong
            />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ────────────────────────── profit & loss ────────────────────── */

export function ProfitLossCalculator() {
  const [buy, setBuy] = useState<number | null>(1000)
  const [sell, setSell] = useState<number | null>(1150)
  const [quantity, setQuantity] = useState<number | null>(100)

  const r = useMemo(() => calcPnl(n(buy), n(sell), n(quantity)), [buy, sell, quantity])
  const win = r.pnl >= 0

  return (
    <ToolLayout
      inputs={
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Buy price" value={buy} onChange={setBuy} min={0} formatter="currency-inr" />
            <NumericInput label="Sell price" value={sell} onChange={setSell} min={0} formatter="currency-inr" />
          </div>
          <NumericInput label="Quantity" value={quantity} onChange={setQuantity} min={0} formatter="integer" />
          <p className="text-xs leading-relaxed text-d-text-muted">
            Gross figures, before brokerage and statutory charges.
          </p>
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label={win ? 'Profit' : 'Loss'}
            value={inr(Math.abs(r.pnl))}
            tone={win ? 'up' : 'down'}
            hint={`${win ? '+' : '−'}${pct(Math.abs(r.returnPercent))} on capital`}
          />
          <ResultGroup>
            <ResultRow label="Invested" value={inr(r.invested, 0)} />
            <ResultRow label="Exit value" value={inr(r.exitValue, 0)} />
            <ResultRow label="Net P&L" value={inr(r.pnl)} strong tone={win ? 'up' : 'down'} />
            <ResultRow label="Return" value={pct(r.returnPercent)} tone={win ? 'up' : 'down'} />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}

/* ─────────────────────── capital gains tax ───────────────────── */

export function CapitalGainsCalculator() {
  const [buy, setBuy] = useState<number | null>(1000)
  const [sell, setSell] = useState<number | null>(1500)
  const [quantity, setQuantity] = useState<number | null>(500)
  const [holdingMonths, setHoldingMonths] = useState<number | null>(18)

  const r = useMemo(
    () => calcCapitalGains(n(buy), n(sell), n(quantity), n(holdingMonths)),
    [buy, sell, quantity, holdingMonths],
  )

  return (
    <ToolLayout
      inputs={
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput label="Buy price" value={buy} onChange={setBuy} min={0} formatter="currency-inr" />
            <NumericInput label="Sell price" value={sell} onChange={setSell} min={0} formatter="currency-inr" />
          </div>
          <NumericInput label="Quantity" value={quantity} onChange={setQuantity} min={0} formatter="integer" />
          <NumericInput
            label="Holding period (months)"
            value={holdingMonths}
            onChange={setHoldingMonths}
            min={0}
            max={600}
            formatter="integer"
            helper="More than 12 months qualifies as long term for listed equity."
          />
          <div className="flex items-center gap-2 pt-1">
            <Badge tone={r.isLongTerm ? 'up' : 'warning'}>{r.isLongTerm ? 'Long term' : 'Short term'}</Badge>
            <span className="text-xs text-d-text-muted">
              Taxed at {pct(r.rate * 100, 1)}
              {r.isLongTerm && ` after ₹${(CAPITAL_GAINS.longTermExemption / 100000).toFixed(2)}L exemption`}
            </span>
          </div>
        </>
      }
      results={
        <ResultPanel>
          <ResultHeadline
            label="Estimated tax"
            value={inr(r.tax, 0)}
            tone={r.tax > 0 ? 'down' : 'neutral'}
            hint={r.gain <= 0 ? 'No tax on a loss' : `Net gain ${inr(r.netGain, 0)}`}
          />
          <ResultGroup>
            <ResultRow label="Total gain" value={inr(r.gain, 0)} tone={r.gain >= 0 ? 'up' : 'down'} />
            {r.exemptionUsed > 0 && <ResultRow label="Exemption used" value={inr(r.exemptionUsed, 0)} tone="up" />}
            <ResultRow label="Taxable gain" value={inr(r.taxableGain, 0)} />
            <ResultRow label="Tax rate" value={pct(r.rate * 100, 1)} />
            <ResultRow label="Net after tax" value={inr(r.netGain, 0)} strong tone={r.netGain >= 0 ? 'up' : 'down'} />
          </ResultGroup>
        </ResultPanel>
      }
    />
  )
}
