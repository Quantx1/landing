'use client'

/**
 * Illustrations, crafted, dimensional SVG accents in the Quant X palette.
 *
 * These are abstract data-viz glyphs (grids, meshes, radars, orbits), the
 * clean geometric kind, NOT the banned hand-drawn "sketchy scene" SVGs. They
 * stand in for raster renders where we have none, and give the feature
 * carousel its image-richness. Each draws on the signature ramp
 * (emerald→cyan→violet) with soft glows, and is purely decorative
 * (aria-hidden, no semantic content).
 */

const RAMP_DEFS = (
  <defs>
    <linearGradient id="il-ramp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#6C4BF5" />
      <stop offset="52%" stopColor="#79A6FF" />
      <stop offset="100%" stopColor="#B1A4FF" />
    </linearGradient>
    <radialGradient id="il-pool" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stopColor="#6C4BF5" stopOpacity="0.22" />
      <stop offset="100%" stopColor="#6C4BF5" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="il-pool-ai" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stopColor="#B1A4FF" stopOpacity="0.26" />
      <stop offset="100%" stopColor="#B1A4FF" stopOpacity="0" />
    </radialGradient>
    <filter id="il-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.4" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
)

const baseProps = {
  viewBox: '0 0 240 180',
  className: 'h-full w-full',
  'aria-hidden': true as const,
  preserveAspectRatio: 'xMidYMid meet',
}

/** Scanner, a grid of cells with a few "matched" rows lit on the ramp. */
export function ScannerGlyph() {
  const cells = []
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 9; c++) {
      const hit = (r === 1 && c > 2) || (r === 3 && c > 4) || (r === 4 && c > 1 && c < 7)
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={26 + c * 21}
          y={30 + r * 20}
          width={15}
          height={12}
          rx={2.5}
          fill={hit ? 'url(#il-ramp)' : 'rgba(255,255,255,0.07)'}
          opacity={hit ? 0.95 : 1}
          filter={hit ? 'url(#il-glow)' : undefined}
        />,
      )
    }
  }
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool)" />
      {cells}
    </svg>
  )
}

/** Copilot, a violet node-mesh converging into one bright node (AI accent). */
export function CopilotGlyph() {
  const nodes = [
    [54, 52], [44, 110], [96, 38], [92, 132], [148, 60], [156, 124], [196, 92],
  ] as const
  const hub = [120, 90] as const
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool-ai)" />
      {nodes.map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={hub[0]} y2={hub[1]} stroke="#B1A4FF" strokeOpacity={0.4} strokeWidth={1.2} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r={4.5} fill="#B1A4FF" fillOpacity={0.85} />
      ))}
      <circle cx={hub[0]} cy={hub[1]} r={13} fill="none" stroke="#B1A4FF" strokeWidth={1.5} opacity={0.6} />
      <circle cx={hub[0]} cy={hub[1]} r={8} fill="#B1A4FF" filter="url(#il-glow)" />
    </svg>
  )
}

/** Portfolio Doctor, a concentric radar with plotted exposure points. */
export function DoctorGlyph() {
  const cx = 120
  const cy = 92
  const pts = [
    [120, 40], [168, 70], [156, 128], [96, 138], [68, 84],
  ] as const
  const poly = pts.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool)" />
      {[20, 36, 52].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      ))}
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = (a * Math.PI) / 180
        return (
          <line
            key={a}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(rad) * 52}
            y2={cy + Math.sin(rad) * 52}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        )
      })}
      <polygon points={poly} fill="#6C4BF5" fillOpacity={0.16} stroke="url(#il-ramp)" strokeWidth={2} filter="url(#il-glow)" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="#79A6FF" />
      ))}
    </svg>
  )
}

/** AutoPilot, an orbit with a tracked satellite, ramp-glow trail. */
export function AutoPilotGlyph() {
  const cx = 120
  const cy = 90
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool)" />
      <ellipse cx={cx} cy={cy} rx={84} ry={44} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
      <ellipse cx={cx} cy={cy} rx={56} ry={28} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      <path
        d={`M ${cx + 84} ${cy} A 84 44 0 0 1 ${cx - 30} ${cy + 41}`}
        fill="none"
        stroke="url(#il-ramp)"
        strokeWidth={2.4}
        strokeLinecap="round"
        filter="url(#il-glow)"
      />
      <circle cx={cx} cy={cy} r={11} fill="none" stroke="url(#il-ramp)" strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={5} fill="#6C4BF5" filter="url(#il-glow)" />
      <circle cx={cx + 84} cy={cy} r={6} fill="#79A6FF" filter="url(#il-glow)" />
    </svg>
  )
}

/** Regime, three stacked probability bands (bull/sideways/bear). */
export function RegimeGlyph() {
  const bars = [
    { y: 44, w: 150, color: '#2FBF8A', label: 0.62 },
    { y: 84, w: 92, color: '#E8A33D', label: 0.27 },
    { y: 124, w: 40, color: '#F65D6D', label: 0.11 },
  ]
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool)" />
      {bars.map((b) => (
        <g key={b.y}>
          <rect x={30} y={b.y} width={184} height={20} rx={5} fill="rgba(255,255,255,0.05)" />
          <rect x={30} y={b.y} width={b.w} height={20} rx={5} fill={b.color} opacity={0.85} filter="url(#il-glow)" />
        </g>
      ))}
    </svg>
  )
}

/** Mood, a sentiment gauge needle on the ramp arc. */
export function MoodGlyph() {
  const cx = 120
  const cy = 120
  const r = 66
  // needle at ~ +0.35 (slightly bullish)
  const angle = Math.PI - (0.5 + 0.35) * (Math.PI / 2) * 1.0
  return (
    <svg {...baseProps}>
      {RAMP_DEFS}
      <rect width="240" height="180" fill="url(#il-pool)" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="url(#il-ramp)" strokeWidth={5} strokeLinecap="round" filter="url(#il-glow)" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(angle) * (r - 12)} y2={cy - Math.sin(angle) * (r - 12)} stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill="#fff" />
    </svg>
  )
}
