'use client'

/**
 * CandleChart, a crafted, dimensional candlestick + signal-overlay SVG in
 * the Quant X palette. NOT image-gen: pure hand-built SVG (glowing area line,
 * duotone candles, BUY/SELL pins) used as the chart inside product mockups
 * and as a feature accent, the same role glowing chart renders play in the
 * category's premium feature sell-pages.
 *
 * Honest: the values are illustrative geometry inside a product render, not a
 * real instrument or a results claim. Page copy never states fabricated returns.
 */

interface Candle {
  o: number
  c: number
  h: number
  l: number
}

// A representative up-trending session series (illustrative geometry).
const CANDLES: Candle[] = [
  { o: 40, c: 46, h: 50, l: 37 },
  { o: 46, c: 42, h: 49, l: 39 },
  { o: 42, c: 51, h: 54, l: 41 },
  { o: 51, c: 49, h: 56, l: 46 },
  { o: 49, c: 58, h: 61, l: 47 },
  { o: 58, c: 55, h: 63, l: 53 },
  { o: 55, c: 64, h: 67, l: 54 },
  { o: 64, c: 72, h: 75, l: 62 },
  { o: 72, c: 68, h: 77, l: 66 },
  { o: 68, c: 78, h: 82, l: 67 },
  { o: 78, c: 86, h: 89, l: 76 },
  { o: 86, c: 82, h: 90, l: 80 },
  { o: 82, c: 92, h: 96, l: 81 },
  { o: 92, c: 100, h: 104, l: 90 },
]

export function CandleChart({ className = '' }: { className?: string }) {
  const W = 520
  const H = 260
  const padX = 14
  const padTop = 18
  const padBottom = 26
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom
  const step = innerW / CANDLES.length
  const bodyW = step * 0.46

  // value domain
  const vals = CANDLES.flatMap((c) => [c.h, c.l])
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  const y = (v: number) => padTop + innerH - ((v - min) / span) * innerH
  const cx = (i: number) => padX + step * i + step / 2

  // smooth close-line + area for the glow
  const closePts = CANDLES.map((c, i) => [cx(i), y(c.c)] as const)
  const linePath = closePts
    .map(([x, yy], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${yy.toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L${closePts[closePts.length - 1][0].toFixed(1)},${(padTop + innerH).toFixed(
    1,
  )} L${closePts[0][0].toFixed(1)},${(padTop + innerH).toFixed(1)} Z`

  // markers, BUY low-left, SELL near the top
  const buyIdx = 2
  const sellIdx = 11

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Illustrative candlestick chart with entry and exit markers"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C4BF5" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#79A6FF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#79A6FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cc-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6C4BF5" />
          <stop offset="100%" stopColor="#79A6FF" />
        </linearGradient>
        <filter id="cc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* faint horizontal gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={W - padX}
          y1={padTop + innerH * g}
          y2={padTop + innerH * g}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
        />
      ))}

      {/* candles */}
      {CANDLES.map((c, i) => {
        const up = c.c >= c.o
        const color = up ? '#2FBF8A' : '#F65D6D'
        const x = cx(i)
        const top = y(Math.max(c.o, c.c))
        const bottom = y(Math.min(c.o, c.c))
        return (
          <g key={i} opacity={0.62}>
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1.2} />
            <rect
              x={x - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(2, bottom - top)}
              rx={1}
              fill={color}
            />
          </g>
        )
      })}

      {/* glowing close-line + area */}
      <path d={areaPath} fill="url(#cc-area)" />
      <path d={linePath} fill="none" stroke="url(#cc-line)" strokeWidth={2.4} filter="url(#cc-glow)" strokeLinejoin="round" strokeLinecap="round" />

      {/* BUY marker */}
      <g transform={`translate(${cx(buyIdx)}, ${y(CANDLES[buyIdx].c)})`}>
        <circle r="11" fill="#0b0b0c" stroke="#2FBF8A" strokeWidth="1.5" />
        <circle r="4.5" fill="#2FBF8A" />
        <text x="16" y="4" fontSize="11" fontWeight="700" fill="#2FBF8A" fontFamily="var(--font-mono)">BUY</text>
      </g>

      {/* SELL marker */}
      <g transform={`translate(${cx(sellIdx)}, ${y(CANDLES[sellIdx].h) - 6})`}>
        <circle r="11" fill="#0b0b0c" stroke="#F65D6D" strokeWidth="1.5" />
        <circle r="4.5" fill="#F65D6D" />
        <text x="-46" y="4" fontSize="11" fontWeight="700" fill="#F65D6D" fontFamily="var(--font-mono)">SELL</text>
      </g>
    </svg>
  )
}
