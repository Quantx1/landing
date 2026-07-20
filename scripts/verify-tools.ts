/**
 * Regression checks for the free-tools calculation core (lib/tools/calc.ts).
 *
 * Run with `npm run verify:tools`. Expected values are hand-computed or come
 * from the standard closed-form formulas — if you change a rate in
 * lib/tools/rates.ts, the brokerage and capital-gains cases here will move and
 * should be re-derived deliberately rather than adjusted to fit.
 */
import {
  calcBrokerage, calcPositionSize, calcSip, calcLumpsum, calcRequiredSip,
  calcCagr, calcRiskReward, calcAveragePrice, calcMargin, calcPnl,
  calcCapitalGains, calcPivotsClassic, calcYearsToGoal,
} from '../lib/tools/calc'

let fail = 0
const near = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= tol
function check(name: string, got: number, want: number, tol?: number) {
  const ok = near(got, want, tol)
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(42)} got=${got}  want=${want}`)
}

// SIP: 10k/mo @12% for 10y ≈ 23.23 lakh (standard annuity-due formula)
check('sip 10k 12% 10y futureValue', calcSip(10000, 12, 10).futureValue, 2323391, 500)
check('sip invested', calcSip(10000, 12, 10).invested, 1200000)
check('sip zero rate', calcSip(1000, 0, 1).futureValue, 12000)

// Lumpsum: 1L @12% 10y = 3.1058L
check('lumpsum 1L 12% 10y', calcLumpsum(100000, 12, 10).futureValue, 310584.82, 1)

// CAGR: 1L -> 2L over 5y = 14.87%
check('cagr 100k->200k 5y', calcCagr(100000, 200000, 5), 14.87)
check('cagr guard zero years', calcCagr(100000, 200000, 0), 0)

// Required SIP to hit 1cr in 15y @12%
const rs = calcRequiredSip(10000000, 12, 15)
check('requiredSip round-trips', calcSip(rs, 12, 15).futureValue, 10000000, 50)

// Position sizing
const ps = calcPositionSize({ capital: 100000, riskPercent: 2, entry: 100, stopLoss: 95 })
check('possize riskAmount', ps.riskAmount, 2000)
check('possize quantity', ps.quantity, 400)
check('possize positionValue', ps.positionValue, 40000)
check('possize stopDistance%', ps.stopDistancePercent, 5)

// Risk/reward
const rr = calcRiskReward(100, 95, 115)
check('rr ratio', rr.ratio, 3)
check('rr breakeven win rate', rr.breakevenWinRatePercent, 25)

// Brokerage — equity delivery, hand-computed above
const b = calcBrokerage({ segment: 'delivery', buyPrice: 100, sellPrice: 110, quantity: 100 })
check('delivery stt', b.stt, 21)
check('delivery stampDuty', b.stampDuty, 1.5)
check('delivery brokerage (free)', b.brokerage, 0)
check('delivery grossPnl', b.grossPnl, 1000)
check('delivery netPnl', b.netPnl, 960.81, 0.5)
// Intraday brokerage caps at 20/order
const bi = calcBrokerage({ segment: 'intraday', buyPrice: 1000, sellPrice: 1010, quantity: 1000 })
check('intraday brokerage capped 20+20', bi.brokerage, 40)

// Averaging
const avg = calcAveragePrice([{ price: 100, quantity: 10 }, { price: 80, quantity: 10 }])
check('average price', avg.averagePrice, 90)
check('average totalQty', avg.totalQuantity, 20)

// Margin / PnL
check('margin 5x', calcMargin(100, 100, 5).marginRequired, 2000)
check('pnl return%', calcPnl(100, 120, 10).returnPercent, 20)

// Capital gains — LTCG exemption 1.25L, rate 12.5%
const ltcg = calcCapitalGains(100, 300, 1000, 18) // gain 2,00,000 long term
check('ltcg exemptionUsed', ltcg.exemptionUsed, 125000)
check('ltcg taxableGain', ltcg.taxableGain, 75000)
check('ltcg tax', ltcg.tax, 9375)
const stcg = calcCapitalGains(100, 200, 1000, 6) // gain 1,00,000 short term
check('stcg tax @20%', stcg.tax, 20000)
check('stcg no exemption', stcg.exemptionUsed, 0)
const loss = calcCapitalGains(200, 100, 100, 6)
check('loss -> zero tax', loss.tax, 0)

// Pivots — H110 L90 C100 -> P=100, R1=110, S1=90
const pv = calcPivotsClassic(110, 90, 100)
check('pivot', pv.pivot, 100)
check('pivot r1', pv.r1, 110)
check('pivot s1', pv.s1, 90)

// Goal planner
check('yearsToGoal already there', calcYearsToGoal(200000, 5000, 100000, 12), 0)
const y = calcYearsToGoal(0, 10000, 2323391, 12)
check('yearsToGoal matches sip', y, 10, 0.1)

// NaN guards
check('NaN input -> 0', calcSip(NaN, 12, 10).futureValue, 0)
check('divide-by-zero guard', calcPositionSize({ capital: 1e5, riskPercent: 2, entry: 100, stopLoss: 100 }).quantity, 0)

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`)
process.exit(fail === 0 ? 0 : 1)
