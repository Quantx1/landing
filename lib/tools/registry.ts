/**
 * Registry for the free public tools.
 *
 * Single source of truth for routing, the /tools index, nav links and
 * per-page SEO metadata. Adding a tool means adding an entry here plus a
 * component in components/tools/calculators/, then wiring the slug into
 * components/tools/ToolView.tsx.
 *
 * These pages are fully public — no auth, no API calls, no user data. All
 * maths runs client-side (see ./calc.ts), so they work offline and cost
 * nothing to serve beyond static hosting.
 */

import {
  BarChart3, Coins, Crosshair, Gauge, Landmark, Layers, Receipt,
  Repeat, Scale, Sigma, Target, TrendingUp, type LucideIcon,
} from '@/lib/icons'

export type ToolCategory = 'Trading' | 'Returns' | 'Portfolio' | 'Tax'

export interface Tool {
  slug: string
  /** Short name, used in nav + cards. */
  name: string
  /** <title> — keep under ~60 chars, front-load the keyword. */
  title: string
  /** One line under the card title, and the page sub-head. */
  tagline: string
  /** <meta description> — 140-160 chars. */
  description: string
  category: ToolCategory
  icon: LucideIcon
  /** Rendered as prose under the calculator; good for SEO and genuinely useful. */
  about: string
  faq: { q: string; a: string }[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'brokerage-calculator',
    name: 'Brokerage Calculator',
    title: 'Brokerage Calculator — Charges, STT & GST on NSE Trades',
    tagline: 'Every charge on a trade, itemised.',
    description:
      'Free brokerage calculator for Indian equity delivery, intraday, futures and options. See brokerage, STT, exchange charges, GST, stamp duty and your real break-even.',
    category: 'Trading',
    icon: Receipt,
    about:
      'The price you see is not the price you pay. Between brokerage, STT, exchange transaction charges, SEBI turnover fees, stamp duty, GST and depository charges, a round trip carries seven separate line items. This calculator itemises all of them for equity delivery, intraday, futures and options, and tells you the one number that actually matters — how far the stock has to move before you break even.',
    faq: [
      { q: 'Why is my break-even higher than I expected?', a: 'STT and stamp duty are charged on turnover, not on profit, so you pay them whether the trade wins or loses. On delivery trades STT applies to both the buy and the sell leg, which is why the break-even moves further than most people assume.' },
      { q: 'Does this match my broker exactly?', a: 'Statutory charges — STT, exchange, SEBI, stamp duty, GST — are the same everywhere. Brokerage is not. Defaults here follow the discount-broker model (zero on delivery, ₹20 or 0.03% on intraday), and you can override the per-order fee to match your broker.' },
      { q: 'What are DP charges?', a: 'A flat depository fee charged by CDSL/NSDL and your broker each time you sell from your demat account. It applies per scrip per day on delivery sells, regardless of quantity, which makes small delivery sells disproportionately expensive.' },
    ],
  },
  {
    slug: 'position-size-calculator',
    name: 'Position Size Calculator',
    title: 'Position Size Calculator — Risk-Based Share Quantity',
    tagline: 'How many shares to buy for a fixed rupee risk.',
    description:
      'Work out exact share quantity from your capital, risk percentage, entry and stop-loss. The single most important calculation in risk management.',
    category: 'Trading',
    icon: Crosshair,
    about:
      'Most retail losses are position-sizing failures rather than stock-picking failures. Fix the rupee amount you are willing to lose on a trade — typically 1–2% of capital — and the quantity follows arithmetically from your stop distance. A wide stop means fewer shares, a tight stop means more, and your loss stays constant either way. That constancy is what lets a strategy survive a losing streak.',
    faq: [
      { q: 'What risk percentage should I use?', a: 'One to two percent of total capital per trade is the common range. At 2%, ten consecutive losses draw you down roughly 18% — recoverable. At 10% per trade, the same streak is close to account-ending.' },
      { q: 'Why did I get zero shares?', a: 'Your stop is too far from entry for the risk budget. Either widen the risk percentage, or accept that this particular setup is too wide for your account size and skip it.' },
      { q: 'Should position value exceed my capital?', a: 'On delivery, no. If the calculator returns a position larger than your capital it means your stop is extremely tight; treat that as a signal the stop is inside normal noise rather than as permission to leverage.' },
    ],
  },
  {
    slug: 'risk-reward-calculator',
    name: 'Risk / Reward Calculator',
    title: 'Risk Reward Ratio Calculator — With Break-Even Win Rate',
    tagline: 'Your R:R, and the win rate it demands.',
    description:
      'Calculate risk-reward ratio from entry, stop-loss and target — plus the exact win rate you need for the setup to break even over time.',
    category: 'Trading',
    icon: Scale,
    about:
      'A risk-reward ratio on its own says nothing about whether a strategy makes money. What matters is the ratio paired with your hit rate. A 1:3 setup only needs to work 25% of the time to break even; a 1:1 setup needs 50%. This calculator gives you both numbers together, so you can judge a setup against how often you actually expect it to work rather than against a rule of thumb.',
    faq: [
      { q: 'How is break-even win rate derived?', a: 'It is 1 / (1 + R), where R is the reward-to-risk ratio. At R = 3 that is 25%. Clear this rate over a large sample and the strategy is profitable before costs.' },
      { q: 'Is a higher ratio always better?', a: 'No. Ratios stretch by pushing targets further away, and distant targets get hit less often. A 1:5 setup that works 10% of the time loses money; a 1:1.5 setup that works 60% makes it.' },
      { q: 'Does this include charges?', a: 'No — it works in pure price terms. Use the brokerage calculator to find your break-even in points and add that to the risk side for a realistic picture.' },
    ],
  },
  {
    slug: 'pivot-point-calculator',
    name: 'Pivot Point Calculator',
    title: 'Pivot Point Calculator — Classic & Fibonacci Levels',
    tagline: 'Support and resistance from yesterday’s range.',
    description:
      'Generate classic and Fibonacci pivot points with three support and resistance levels from any high, low and close. Widely used for intraday levels.',
    category: 'Trading',
    icon: Layers,
    about:
      'Pivot points convert the previous session’s high, low and close into a central pivot plus three support and three resistance levels. Their usefulness is partly self-fulfilling — enough intraday traders watch the same levels that price often reacts there. Classic pivots space levels by the full range; Fibonacci pivots use 38.2%, 61.8% and 100% retracements, giving tighter inner levels.',
    faq: [
      { q: 'Which session data should I use?', a: 'For intraday levels, the previous trading day’s high, low and close. For weekly levels use last week’s range. Always use the same timeframe for all three inputs.' },
      { q: 'Classic or Fibonacci?', a: 'Classic is the more widely watched, which matters for a self-fulfilling indicator. Fibonacci places R1 and S1 closer to the pivot, which suits range-bound sessions.' },
      { q: 'Do pivots work on their own?', a: 'Treat them as levels of interest, not signals. They tell you where reactions are likely, not which direction to take.' },
    ],
  },
  {
    slug: 'sip-calculator',
    name: 'SIP Calculator',
    title: 'SIP Calculator — Monthly Investment Returns',
    tagline: 'What a monthly SIP grows into.',
    description:
      'Calculate the maturity value of a monthly SIP. See invested amount, estimated returns and total corpus for any monthly contribution, rate and tenure.',
    category: 'Returns',
    icon: Repeat,
    about:
      'A systematic investment plan compounds monthly contributions over time. The striking part is how late the growth arrives: over a 20-year SIP, more than half the final corpus typically accumulates in the last third of the period. That back-loading is why stopping a SIP early is so costly, and why tenure usually matters more than the contribution amount.',
    faq: [
      { q: 'What return rate is realistic?', a: 'Indian equity indices have historically returned roughly 11–13% annualised over long periods, though with wide variation. Between 10% and 12% is a reasonable planning assumption; anything above 15% is optimistic.' },
      { q: 'Is the return guaranteed?', a: 'No. This is a compounding projection at a constant rate. Real markets deliver uneven returns, and sequence matters — a poor final few years can meaningfully reduce the corpus.' },
      { q: 'Does it account for inflation?', a: 'No, results are in nominal rupees. As a rough real-terms adjustment, subtract expected inflation from your return rate before calculating.' },
    ],
  },
  {
    slug: 'lumpsum-calculator',
    name: 'Lumpsum Calculator',
    title: 'Lumpsum Investment Calculator — Compound Growth',
    tagline: 'What a one-time investment becomes.',
    description:
      'Calculate the future value of a one-time investment at any rate of return over any period, with the split between capital invested and returns earned.',
    category: 'Returns',
    icon: Coins,
    about:
      'A lumpsum investment compounds on its entire base from day one, which is why it generally outperforms an equivalent amount fed in gradually — provided the entry point is not a market peak. This calculator shows the split between what you contributed and what compounding produced, which is usually the more persuasive number over long horizons.',
    faq: [
      { q: 'Lumpsum or SIP?', a: 'Mathematically lumpsum wins more often, because money is invested for longer. SIP wins on behaviour and on entry-point risk — it removes the need to time the market and is easier to sustain.' },
      { q: 'How does compounding frequency affect this?', a: 'This calculator compounds annually. More frequent compounding at the same nominal rate produces a slightly higher result; the gap is small at typical equity rates.' },
    ],
  },
  {
    slug: 'cagr-calculator',
    name: 'CAGR Calculator',
    title: 'CAGR Calculator — Compound Annual Growth Rate',
    tagline: 'The annualised return behind any result.',
    description:
      'Calculate compound annual growth rate from a starting value, ending value and holding period. The standard way to compare investments over different tenures.',
    category: 'Returns',
    icon: TrendingUp,
    about:
      'CAGR expresses a total gain as the constant annual rate that would have produced it. It exists to make returns comparable across different holding periods — a 60% gain over two years and a 60% gain over six are very different results, and only the annualised figure makes that obvious. It deliberately smooths away volatility, so it describes the path’s endpoints, not its comfort.',
    faq: [
      { q: 'CAGR or absolute return?', a: 'Absolute return tells you how much you made; CAGR tells you how efficiently. Use CAGR whenever you are comparing investments held for different lengths of time.' },
      { q: 'Why does CAGR hide risk?', a: 'Two investments can share a CAGR while one moved steadily and the other halved before recovering. CAGR reads only the first and last values.' },
    ],
  },
  {
    slug: 'goal-sip-calculator',
    name: 'Goal SIP Calculator',
    title: 'Goal SIP Calculator — Monthly Amount for a Target Corpus',
    tagline: 'Work backwards from the number you need.',
    description:
      'Find the monthly SIP required to reach a target corpus in a given time at an expected rate of return. Plan for a house, education or retirement.',
    category: 'Returns',
    icon: Target,
    about:
      'This inverts the usual SIP question. Instead of asking what a contribution grows into, you name the corpus and the deadline, and it returns the monthly amount required. Doing the arithmetic in this direction tends to be clarifying — it converts a vague goal into a specific monthly commitment, and quickly reveals when a target is unrealistic for the time available.',
    faq: [
      { q: 'The required SIP is unaffordable. What now?', a: 'Three levers: extend the tenure, lower the target, or raise the assumed return. The first is by far the safest — required contribution falls steeply as horizon grows.' },
      { q: 'Should I plan in today’s rupees?', a: 'Inflate the target first. A goal worth ₹50 lakh today is closer to ₹90 lakh in fifteen years at 4% inflation, and planning against the un-inflated figure will leave you short.' },
    ],
  },
  {
    slug: 'average-price-calculator',
    name: 'Average Price Calculator',
    title: 'Stock Average Price Calculator — Multiple Buy Prices',
    tagline: 'Blended cost across every purchase.',
    description:
      'Calculate your weighted average buy price across multiple purchases of the same stock, with total quantity and total invested.',
    category: 'Portfolio',
    icon: Sigma,
    about:
      'When you buy the same stock at several prices, your true cost basis is the quantity-weighted average, not the simple mean of the prices. This matters both for knowing your real break-even and for computing capital gains correctly. Add each purchase lot below to get the blended figure.',
    faq: [
      { q: 'Is this the same as averaging down?', a: 'It is the arithmetic behind it. Averaging down means buying more at a lower price to reduce the blended cost — this shows exactly where that cost lands. Whether it is wise depends on why the price fell.' },
      { q: 'Does the tax department use this average?', a: 'For equities, gains are computed FIFO — first shares bought are treated as first sold — not on a blended average. Use the weighted average for break-even, but FIFO lots for tax.' },
    ],
  },
  {
    slug: 'margin-calculator',
    name: 'Margin Calculator',
    title: 'Margin Calculator — Leverage & Capital Required',
    tagline: 'Capital needed at a given leverage.',
    description:
      'Calculate the margin required to take a position at any leverage, along with total position value and your effective exposure.',
    category: 'Portfolio',
    icon: Gauge,
    about:
      'Margin lets you control a position larger than your capital, which magnifies gains and losses in equal measure. At 5x leverage a 20% adverse move erases the entire margin. The useful discipline is to size positions by the risk you can absorb rather than by the maximum leverage on offer.',
    faq: [
      { q: 'What leverage do Indian brokers offer?', a: 'SEBI peak-margin rules capped intraday equity leverage at roughly 5x since 2021. Delivery is 1x — no leverage. Derivatives leverage varies with SPAN and exposure margins.' },
      { q: 'What happens if the position moves against me?', a: 'Once losses approach your posted margin, the broker issues a margin call or squares off automatically. At 5x, that point arrives after roughly a 20% adverse move.' },
    ],
  },
  {
    slug: 'profit-loss-calculator',
    name: 'Profit & Loss Calculator',
    title: 'Stock Profit Calculator — P&L and Percentage Return',
    tagline: 'Rupee gain and percentage return.',
    description:
      'Calculate profit or loss and percentage return on a stock trade from buy price, sell price and quantity.',
    category: 'Portfolio',
    icon: BarChart3,
    about:
      'A straightforward gain calculation on any trade, in both rupee and percentage terms. The percentage figure is the one worth attending to — a ₹10,000 profit means something quite different on ₹50,000 of capital than on ₹5,00,000. For post-cost figures, run the same trade through the brokerage calculator.',
    faq: [
      { q: 'Is this before or after charges?', a: 'Before. It is the gross difference between buy and sell value. Use the brokerage calculator for the net figure after all statutory charges.' },
      { q: 'How should I read percentage return?', a: 'It is return on the capital deployed in this trade, not on your whole portfolio. It also has no time dimension — use the CAGR calculator to annualise it.' },
    ],
  },
  {
    slug: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator',
    title: 'Capital Gains Tax Calculator — STCG & LTCG on Shares',
    tagline: 'Tax on listed equity gains.',
    description:
      'Estimate short-term and long-term capital gains tax on listed Indian shares, including the annual LTCG exemption and current rates.',
    category: 'Tax',
    icon: Landmark,
    about:
      'Listed equity held over twelve months is taxed as long-term capital gains at 12.5%, with the first ₹1.25 lakh of such gains exempt each financial year. Held for twelve months or less, gains are short-term and taxed at 20%. Both rates were revised by the Finance (No.2) Act 2024. The twelve-month boundary is consequential enough that holding period is worth checking before selling.',
    faq: [
      { q: 'What counts as long term?', a: 'For listed equity and equity mutual funds, a holding period of more than twelve months. The clock runs from purchase date to sale date, not by financial year.' },
      { q: 'How does the ₹1.25 lakh exemption work?', a: 'It applies to aggregate long-term gains across all listed equity in a financial year, not per transaction. Only the excess above ₹1.25 lakh is taxed at 12.5%.' },
      { q: 'Is this figure final?', a: 'No. It excludes surcharge and the 4% health and education cess, and does not account for capital losses carried forward or set off. Treat it as an estimate and confirm with a tax professional.' },
    ],
  },
]

export const TOOL_CATEGORIES: ToolCategory[] = ['Trading', 'Returns', 'Portfolio', 'Tax']

export const getTool = (slug: string): Tool | undefined => TOOLS.find((t) => t.slug === slug)
