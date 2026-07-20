/**
 * Pure calculation core for the free public tools.
 *
 * Every function here is deterministic, dependency-free and framework-free, so
 * it can be unit tested without React and reused server-side. No network, no
 * auth, no user data — these run entirely in the visitor's browser.
 *
 * Statutory rates live in ./rates.ts. Do not inline them here.
 */

import {
  CAPITAL_GAINS,
  GST_RATE,
  SEBI_TURNOVER_RATE,
  SEGMENTS,
  type Segment,
} from './rates'

/* ────────────────────────────── helpers ────────────────────────────── */

/** Guard against NaN/Infinity leaking into the UI from empty or junk inputs. */
export const safe = (n: number): number => (Number.isFinite(n) ? n : 0)

const round2 = (n: number) => Math.round(safe(n) * 100) / 100

/* ──────────────────────── 1. brokerage & charges ───────────────────── */

export interface BrokerageInput {
  segment: Segment
  buyPrice: number
  sellPrice: number
  quantity: number
  /** Override the segment's default brokerage with a flat per-order fee. */
  brokerageOverride?: number
}

export interface BrokerageBreakdown {
  turnover: number
  brokerage: number
  stt: number
  exchangeTxn: number
  sebi: number
  stampDuty: number
  gst: number
  dpCharge: number
  totalCharges: number
  grossPnl: number
  netPnl: number
  breakevenPoints: number
}

export function calcBrokerage(i: BrokerageInput): BrokerageBreakdown {
  const r = SEGMENTS[i.segment]
  const qty = safe(i.quantity)
  const buyValue = safe(i.buyPrice) * qty
  const sellValue = safe(i.sellPrice) * qty
  const turnover = buyValue + sellValue

  // Brokerage is charged per order — two orders (buy + sell) per round trip.
  let perOrder: number
  if (i.brokerageOverride !== undefined) {
    perOrder = safe(i.brokerageOverride)
  } else if (r.brokerage.type === 'free') {
    perOrder = 0
  } else if (r.brokerage.type === 'flat') {
    perOrder = r.brokerage.perOrder
  } else {
    perOrder = Math.min(buyValue * r.brokerage.rate, r.brokerage.capPerOrder)
  }
  const brokerage =
    r.brokerage.type === 'percent' && i.brokerageOverride === undefined
      ? Math.min(buyValue * r.brokerage.rate, r.brokerage.capPerOrder) +
        Math.min(sellValue * r.brokerage.rate, r.brokerage.capPerOrder)
      : perOrder * 2

  const sttBase =
    r.sttOn === 'both' ? turnover : r.sttOn === 'sell' ? sellValue : buyValue
  const stt = sttBase * r.stt

  const exchangeTxn = turnover * r.exchangeTxn
  const sebi = turnover * SEBI_TURNOVER_RATE
  const stampDuty = buyValue * r.stampDuty
  const gst = (brokerage + exchangeTxn + sebi) * GST_RATE
  const dpCharge = r.dpCharge && qty > 0 ? r.dpCharge * (1 + GST_RATE) : 0

  const totalCharges = brokerage + stt + exchangeTxn + sebi + stampDuty + gst + dpCharge
  const grossPnl = sellValue - buyValue

  return {
    turnover: round2(turnover),
    brokerage: round2(brokerage),
    stt: round2(stt),
    exchangeTxn: round2(exchangeTxn),
    sebi: round2(sebi),
    stampDuty: round2(stampDuty),
    gst: round2(gst),
    dpCharge: round2(dpCharge),
    totalCharges: round2(totalCharges),
    grossPnl: round2(grossPnl),
    netPnl: round2(grossPnl - totalCharges),
    breakevenPoints: qty > 0 ? round2(totalCharges / qty) : 0,
  }
}

/* ───────────────────────── 2. position sizing ──────────────────────── */

export interface PositionSizeInput {
  capital: number
  riskPercent: number
  entry: number
  stopLoss: number
}

export interface PositionSizeResult {
  riskAmount: number
  riskPerShare: number
  quantity: number
  positionValue: number
  positionPercentOfCapital: number
  stopDistancePercent: number
}

export function calcPositionSize(i: PositionSizeInput): PositionSizeResult {
  const capital = safe(i.capital)
  const entry = safe(i.entry)
  const stop = safe(i.stopLoss)
  const riskAmount = (capital * safe(i.riskPercent)) / 100
  const riskPerShare = Math.abs(entry - stop)

  const quantity = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0
  const positionValue = quantity * entry

  return {
    riskAmount: round2(riskAmount),
    riskPerShare: round2(riskPerShare),
    quantity,
    positionValue: round2(positionValue),
    positionPercentOfCapital: capital > 0 ? round2((positionValue / capital) * 100) : 0,
    stopDistancePercent: entry > 0 ? round2((riskPerShare / entry) * 100) : 0,
  }
}

/* ────────────────────────── 3. SIP / lumpsum ───────────────────────── */

export interface SipResult {
  invested: number
  futureValue: number
  gains: number
  absoluteReturnPercent: number
}

/** Monthly SIP compounded monthly, contributions at period end. */
export function calcSip(monthly: number, annualRatePercent: number, years: number): SipResult {
  const m = safe(monthly)
  const n = Math.round(safe(years) * 12)
  const r = safe(annualRatePercent) / 100 / 12

  const futureValue =
    r === 0 ? m * n : m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  const invested = m * n

  return {
    invested: round2(invested),
    futureValue: round2(futureValue),
    gains: round2(futureValue - invested),
    absoluteReturnPercent: invested > 0 ? round2(((futureValue - invested) / invested) * 100) : 0,
  }
}

/** One-time investment compounded annually. */
export function calcLumpsum(principal: number, annualRatePercent: number, years: number): SipResult {
  const p = safe(principal)
  const futureValue = p * Math.pow(1 + safe(annualRatePercent) / 100, safe(years))
  return {
    invested: round2(p),
    futureValue: round2(futureValue),
    gains: round2(futureValue - p),
    absoluteReturnPercent: p > 0 ? round2(((futureValue - p) / p) * 100) : 0,
  }
}

/** Monthly SIP needed to reach a target corpus. */
export function calcRequiredSip(target: number, annualRatePercent: number, years: number): number {
  const n = Math.round(safe(years) * 12)
  const r = safe(annualRatePercent) / 100 / 12
  if (n <= 0) return 0
  if (r === 0) return round2(safe(target) / n)
  return round2(safe(target) / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)))
}

/* ───────────────────────────── 4. CAGR ─────────────────────────────── */

export function calcCagr(initial: number, final: number, years: number): number {
  const i = safe(initial)
  const y = safe(years)
  if (i <= 0 || y <= 0) return 0
  return round2((Math.pow(safe(final) / i, 1 / y) - 1) * 100)
}

/* ─────────────────────── 5. risk / reward ratio ────────────────────── */

export interface RiskRewardResult {
  risk: number
  reward: number
  ratio: number
  breakevenWinRatePercent: number
  rewardPercent: number
  riskPercent: number
}

export function calcRiskReward(entry: number, stop: number, target: number): RiskRewardResult {
  const e = safe(entry)
  const risk = Math.abs(e - safe(stop))
  const reward = Math.abs(safe(target) - e)
  const ratio = risk > 0 ? reward / risk : 0

  return {
    risk: round2(risk),
    reward: round2(reward),
    ratio: round2(ratio),
    // Win rate at which expectancy is zero: 1 / (1 + R).
    breakevenWinRatePercent: ratio > 0 ? round2((1 / (1 + ratio)) * 100) : 0,
    rewardPercent: e > 0 ? round2((reward / e) * 100) : 0,
    riskPercent: e > 0 ? round2((risk / e) * 100) : 0,
  }
}

/* ──────────────────── 6. average price (averaging) ─────────────────── */

export interface Lot {
  price: number
  quantity: number
}

export function calcAveragePrice(lots: Lot[]): {
  totalQuantity: number
  totalInvested: number
  averagePrice: number
} {
  const totalQuantity = lots.reduce((s, l) => s + safe(l.quantity), 0)
  const totalInvested = lots.reduce((s, l) => s + safe(l.price) * safe(l.quantity), 0)
  return {
    totalQuantity,
    totalInvested: round2(totalInvested),
    averagePrice: totalQuantity > 0 ? round2(totalInvested / totalQuantity) : 0,
  }
}

/* ──────────────────────────── 7. margin ────────────────────────────── */

export function calcMargin(price: number, quantity: number, leverage: number) {
  const value = safe(price) * safe(quantity)
  const lev = Math.max(1, safe(leverage))
  return {
    positionValue: round2(value),
    marginRequired: round2(value / lev),
    leverage: lev,
  }
}

/* ────────────────────── 8. profit & loss / return ──────────────────── */

export function calcPnl(buy: number, sell: number, quantity: number) {
  const invested = safe(buy) * safe(quantity)
  const exitValue = safe(sell) * safe(quantity)
  const pnl = exitValue - invested
  return {
    invested: round2(invested),
    exitValue: round2(exitValue),
    pnl: round2(pnl),
    returnPercent: invested > 0 ? round2((pnl / invested) * 100) : 0,
  }
}

/* ─────────────────────── 9. capital gains tax ──────────────────────── */

export interface CapitalGainsResult {
  gain: number
  isLongTerm: boolean
  taxableGain: number
  exemptionUsed: number
  rate: number
  tax: number
  netGain: number
}

export function calcCapitalGains(
  buy: number,
  sell: number,
  quantity: number,
  holdingMonths: number,
): CapitalGainsResult {
  const gain = (safe(sell) - safe(buy)) * safe(quantity)
  const isLongTerm = safe(holdingMonths) >= CAPITAL_GAINS.longTermMonths

  if (gain <= 0) {
    return {
      gain: round2(gain),
      isLongTerm,
      taxableGain: 0,
      exemptionUsed: 0,
      rate: 0,
      tax: 0,
      netGain: round2(gain),
    }
  }

  const exemptionUsed = isLongTerm ? Math.min(gain, CAPITAL_GAINS.longTermExemption) : 0
  const taxableGain = gain - exemptionUsed
  const rate = isLongTerm ? CAPITAL_GAINS.longTermRate : CAPITAL_GAINS.shortTermRate
  const tax = taxableGain * rate

  return {
    gain: round2(gain),
    isLongTerm,
    taxableGain: round2(taxableGain),
    exemptionUsed: round2(exemptionUsed),
    rate,
    tax: round2(tax),
    netGain: round2(gain - tax),
  }
}

/* ────────────────────────── 10. pivot points ───────────────────────── */

export interface Pivots {
  pivot: number
  r1: number
  r2: number
  r3: number
  s1: number
  s2: number
  s3: number
}

export function calcPivotsClassic(high: number, low: number, close: number): Pivots {
  const h = safe(high)
  const l = safe(low)
  const p = (h + l + safe(close)) / 3
  const range = h - l
  return {
    pivot: round2(p),
    r1: round2(2 * p - l),
    r2: round2(p + range),
    r3: round2(h + 2 * (p - l)),
    s1: round2(2 * p - h),
    s2: round2(p - range),
    s3: round2(l - 2 * (h - p)),
  }
}

export function calcPivotsFibonacci(high: number, low: number, close: number): Pivots {
  const h = safe(high)
  const l = safe(low)
  const p = (h + l + safe(close)) / 3
  const range = h - l
  return {
    pivot: round2(p),
    r1: round2(p + 0.382 * range),
    r2: round2(p + 0.618 * range),
    r3: round2(p + range),
    s1: round2(p - 0.382 * range),
    s2: round2(p - 0.618 * range),
    s3: round2(p - range),
  }
}

/* ──────────────────── 11. compounding / goal planner ───────────────── */

export function calcYearsToGoal(
  current: number,
  monthly: number,
  target: number,
  annualRatePercent: number,
): number {
  const r = safe(annualRatePercent) / 100 / 12
  let balance = safe(current)
  const m = safe(monthly)
  const t = safe(target)
  if (balance >= t) return 0
  if (m <= 0 && r <= 0) return 0

  for (let month = 1; month <= 12 * 100; month++) {
    balance = balance * (1 + r) + m
    if (balance >= t) return round2(month / 12)
  }
  return Infinity
}

/* ─────────────────────── 12. inflation-adjusted ────────────────────── */

export function calcRealValue(amount: number, inflationPercent: number, years: number): number {
  return round2(safe(amount) / Math.pow(1 + safe(inflationPercent) / 100, safe(years)))
}
