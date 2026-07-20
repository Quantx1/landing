/**
 * Statutory rates and charges for Indian equity / F&O trading.
 *
 * ⚠️  THESE CHANGE. Exchange transaction charges, STT and stamp duty are all
 * revised by circular, sometimes more than once a year. Everything is
 * centralised here so an update is a one-file edit — do NOT inline these
 * numbers into calculators.
 *
 * Verify against the primary sources before trusting output:
 *   - STT / CTT          → incometaxindia.gov.in
 *   - Exchange txn charge → nseindia.com & bseindia.com circulars
 *   - SEBI turnover fee   → sebi.gov.in
 *   - Stamp duty          → Indian Stamp Act (uniform since 01-Jul-2020)
 *
 * `RATES_EFFECTIVE` is surfaced in the UI so users can see how fresh this is.
 */

export const RATES_EFFECTIVE = '2026-01-01'

/** GST on (brokerage + transaction charges + SEBI fee). */
export const GST_RATE = 0.18

/** SEBI turnover fee: ₹10 per crore of turnover. */
export const SEBI_TURNOVER_RATE = 0.000001

export type Segment = 'delivery' | 'intraday' | 'futures' | 'options'

export interface SegmentRates {
  label: string
  /** STT as a fraction of turnover. */
  stt: number
  /** Which leg STT applies to. */
  sttOn: 'buy' | 'sell' | 'both'
  /** Exchange transaction charge as a fraction of turnover (NSE). */
  exchangeTxn: number
  /** Stamp duty as a fraction of turnover, buy side only. */
  stampDuty: number
  /** Default brokerage model — discount-broker style. User-overridable in the UI. */
  brokerage:
    | { type: 'free' }
    | { type: 'flat'; perOrder: number }
    | { type: 'percent'; rate: number; capPerOrder: number }
  /** Depository participant charge, applied per sell order (delivery only). */
  dpCharge?: number
  notes: string
}

export const SEGMENTS: Record<Segment, SegmentRates> = {
  delivery: {
    label: 'Equity Delivery',
    stt: 0.001,
    sttOn: 'both',
    exchangeTxn: 0.0000297,
    stampDuty: 0.00015,
    brokerage: { type: 'free' },
    dpCharge: 13.5,
    notes: 'STT 0.1% on both legs. Stamp duty on buy only. DP charge per sell scrip.',
  },
  intraday: {
    label: 'Equity Intraday',
    stt: 0.00025,
    sttOn: 'sell',
    exchangeTxn: 0.0000297,
    stampDuty: 0.00003,
    brokerage: { type: 'percent', rate: 0.0003, capPerOrder: 20 },
    notes: 'STT 0.025% on sell only. Brokerage 0.03% or ₹20 per order, whichever is lower.',
  },
  futures: {
    label: 'Equity Futures',
    stt: 0.0002,
    sttOn: 'sell',
    exchangeTxn: 0.0000173,
    stampDuty: 0.00002,
    brokerage: { type: 'flat', perOrder: 20 },
    notes: 'STT 0.02% on sell only.',
  },
  options: {
    label: 'Equity Options',
    stt: 0.001,
    sttOn: 'sell',
    exchangeTxn: 0.0003503,
    stampDuty: 0.00003,
    brokerage: { type: 'flat', perOrder: 20 },
    notes: 'STT 0.1% on sell, charged on premium. Transaction charge is on premium turnover.',
  },
}

/**
 * Capital gains on listed equity (STT paid).
 * Revised by Finance (No.2) Act 2024, effective 23-Jul-2024.
 */
export const CAPITAL_GAINS = {
  /** Holding period above which equity gains are long term. */
  longTermMonths: 12,
  shortTermRate: 0.2,
  longTermRate: 0.125,
  /** Annual LTCG exemption on listed equity + equity MF. */
  longTermExemption: 125000,
  surchargeNote: 'Excludes surcharge and 4% health & education cess.',
} as const
