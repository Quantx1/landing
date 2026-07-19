'use client'

/**
 * Product mockups, our REAL UI building blocks (foundation StatCard, Badge,
 * ChangeBadge, Sparkline) composed with clearly ILLUSTRATIVE sample values and
 * presented as product screenshots inside a BrowserFrame.
 *
 * Honesty contract (brand firewall + no fabricated returns):
 *   • These are product renders with representative EXAMPLE values labelled
 *     as a preview ("Setup preview" / "30d example"), NOT live data and NOT a
 *     guaranteed or real return. Page-level FAQ + footer say the same.
 *   • Copy uses only the public engine names (Alpha / Mood / Regime /
 *     Counterpoint / AutoPilot / Copilot), never model architectures.
 *
 * Chrome uses the pinned-dark `.mock-*` token classes (globals.css) so the
 * sample UI reads as the product's own dark theme on BOTH page themes, same
 * rationale as `.dark-media`. No raw-hex Tailwind (passes the hex lint).
 *
 * Why presentational signal/scanner panels (not the live SignalCard): the real
 * SignalCard is a <button> that routes on click and SWR-fetches a price series.
 * In a marketing surface we want an inert, network-free screenshot. These
 * panels mirror SignalCard's exact structure + tokens (Badge, levels grid,
 * confidence meter, R:R footer, ChangeBadge) so it reads as the same product.
 */

import { Badge, ChangeBadge, Sparkline, StatCard } from '@/components/foundation'
import { CandleChart } from './CandleChart'

/* ─────────────────────────  AI SIGNAL MOCKUP  ───────────────────────── */

// A representative BUY signal (illustrative, not a live or recommended trade).
const SAMPLE_SIGNAL = {
  symbol: 'RELIANCE',
  exchange: 'NSE',
  entry: 2847.5,
  stop: 2790.0,
  target: 2980.0,
  confidence: 78,
  rr: 2.31,
}

const movePct = ((SAMPLE_SIGNAL.target - SAMPLE_SIGNAL.entry) / SAMPLE_SIGNAL.entry) * 100
const riskPct = Math.abs(((SAMPLE_SIGNAL.entry - SAMPLE_SIGNAL.stop) / SAMPLE_SIGNAL.entry) * 100)

export function SignalMockup() {
  const s = SAMPLE_SIGNAL
  return (
    <div className="space-y-3">
      {/* the framed chart (crafted SVG) */}
      <div className="mock-panel mock-edge relative overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="mock-ink text-[14px] font-bold">{s.symbol}</span>
            <span className="mock-ink-mute font-mono text-[10px] uppercase tracking-wide">{s.exchange} · 1D</span>
          </div>
          <span className="mock-up mock-up-tint mock-up-border inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Alpha · Regime · Mood
          </span>
        </div>
        <div className="h-[150px] px-1">
          <CandleChart />
        </div>
      </div>

      {/* the signal card, mirrors SignalCard structure + tokens */}
      <div className="mock-card mock-edge rounded-xl border p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="mock-ink text-[15px] font-bold">{s.symbol}</span>
              <span className="mock-ink-mute text-[10px] font-medium uppercase tracking-wide">{s.exchange}</span>
            </div>
            <div className="mock-ink-mute mt-0.5 text-[10.5px]">Setup preview · example</div>
          </div>
          <Badge tone="buy">BUY</Badge>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <Sparkline
            data={[2800, 2815, 2790, 2822, 2808, 2841, 2835, 2847]}
            width={132}
            height={40}
            tone="up"
            filled
            strokeWidth={1.75}
          />
          <div className="text-right">
            <div className="mock-ink-mute text-[10px] uppercase tracking-wide">Confidence</div>
            <div className="mt-1 flex items-center justify-end gap-1.5">
              <div className="mock-track h-1.5 w-14 overflow-hidden rounded-full">
                <div className="mock-bg-up h-full rounded-full" style={{ width: `${s.confidence}%` }} />
              </div>
              <span className="mock-ink font-mono text-[13px] font-semibold tabular-nums">{s.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <LevelTile label="Entry" value={s.entry} tone="neutral" />
          <LevelTile label="Stop" value={s.stop} tone="down" sub={`−${riskPct.toFixed(1)}%`} />
          <LevelTile label="Target" value={s.target} tone="up" sub={`+${movePct.toFixed(1)}%`} />
        </div>

        <div className="mock-edge mt-3 flex items-center justify-between border-t pt-2.5 text-[11px]">
          <span className="mock-ink-mute">
            R:R <span className="mock-ink font-mono font-semibold">1:{s.rr.toFixed(2)}</span>
          </span>
          <ChangeBadge value={movePct} kind="percent" size="sm" />
        </div>
      </div>
    </div>
  )
}

function LevelTile({
  label,
  value,
  tone,
  sub,
}: {
  label: string
  value: number
  tone: 'up' | 'down' | 'neutral'
  sub?: string
}) {
  const color = tone === 'up' ? 'mock-up' : tone === 'down' ? 'mock-down' : 'mock-ink'
  return (
    <div className="mock-inset mock-edge rounded-lg border px-2 py-1.5">
      <div className="mock-ink-mute text-[9px] font-medium uppercase tracking-wide">{label}</div>
      <div className={`mt-0.5 truncate font-mono text-[12.5px] font-semibold tabular-nums ${color}`}>₹{value.toFixed(2)}</div>
      {sub && <div className="mock-ink-mute font-mono text-[9px] tabular-nums">{sub}</div>}
    </div>
  )
}

/* ─────────────────────────  STAT ROW MOCKUP  ───────────────────────── */
/* Uses the real foundation StatCard with illustrative sample values. */

export function StatRowMockup() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Paper equity" value="₹11,84,210" delta={{ value: 1.42 }} spark={[10, 10.4, 10.2, 10.9, 11.3, 11.1, 11.8]} />
      <StatCard label="Open positions" value="6" />
      <StatCard label="Win rate · 30d" value="61.4%" delta={{ value: 3.2 }} />
      <StatCard label="Best 30d" value="+18.7%" spark={[2, 4, 3, 7, 9, 12, 18.7]} />
    </div>
  )
}

/* ─────────────────────────  SCANNER MOCKUP  ───────────────────────── */

const SCAN_ROWS = [
  { sym: 'TATAMOTORS', pattern: 'Bull flag', tf: '1D', pct: 2.41, conf: 82 },
  { sym: 'HDFCBANK', pattern: 'Cup & handle', tf: '1D', pct: 1.08, conf: 74 },
  { sym: 'INFY', pattern: 'Asc. triangle', tf: '4H', pct: 0.62, conf: 69 },
  { sym: 'SBIN', pattern: 'Breakout', tf: '1D', pct: 3.17, conf: 88 },
  { sym: 'LT', pattern: 'Higher low', tf: '1D', pct: -0.44, conf: 58 },
]

export function ScannerMockup() {
  return (
    <div className="mock-panel mock-edge overflow-hidden rounded-xl border">
      <div className="mock-edge flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="mock-ink text-[13px] font-semibold">Pattern scanner</span>
          <span className="mock-surface-06 mock-ink-dim rounded-pill px-2 py-0.5 font-mono text-[10px]">NSE · 1,800+ stocks</span>
        </div>
        <span className="mock-up inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="mock-bg-up absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
            <span className="mock-bg-up relative inline-flex h-1.5 w-1.5 rounded-full" />
          </span>
          Live
        </span>
      </div>
      <div className="mock-ink-mute grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.1em]">
        <span>Symbol · pattern</span>
        <span className="text-right">TF</span>
        <span className="text-right">Move</span>
        <span className="text-right">Conf</span>
      </div>
      {SCAN_ROWS.map((r) => (
        <div
          key={r.sym}
          className="mock-edge-soft grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-t px-4 py-2.5"
        >
          <div className="min-w-0">
            <div className="mock-ink truncate text-[12.5px] font-semibold">{r.sym}</div>
            <div className="mock-ink-mute truncate text-[10.5px]">{r.pattern}</div>
          </div>
          <span className="mock-ink-dim text-right font-mono text-[11px]">{r.tf}</span>
          <span className={`text-right font-mono text-[12px] font-semibold tabular-nums ${r.pct >= 0 ? 'mock-up' : 'mock-down'}`}>
            {r.pct >= 0 ? '+' : ''}
            {r.pct.toFixed(2)}%
          </span>
          <span className="mock-ink text-right font-mono text-[12px] tabular-nums">{r.conf}</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────  COPILOT MOCKUP  ───────────────────────── */
/* The Main-Chat composer + a streamed answer with a tiny inline GenUI chart.
   Violet is the AI-only accent. */

const AiSpark = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
  </svg>
)

export function CopilotMockup() {
  return (
    <div className="space-y-3">
      {/* user query bubble */}
      <div className="flex justify-end">
        <div className="mock-bubble mock-ink-soft max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-[12.5px]">
          Why is RELIANCE a BUY today?
        </div>
      </div>

      {/* assistant answer with inline GenUI artifact */}
      <div className="flex gap-2.5">
        <span className="mock-ai mock-ai-border mock-window mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border">
          {AiSpark}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mock-ink-soft text-[12.5px] leading-relaxed">
            Alpha ranks RELIANCE in the top decile this session; Regime reads{' '}
            <span className="mock-up font-semibold">bull</span> and Mood is net-positive on the tape. Entry ₹2,847 with a
            2.3:1 reward-to-risk.
          </p>
          {/* inline GenUI mini chart card */}
          <div className="mock-panel mock-edge mt-2.5 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="mock-ink-mute font-mono text-[9.5px] uppercase tracking-[0.12em]">RELIANCE · 30d</span>
              <span className="mock-up font-mono text-[11px] font-semibold tabular-nums">+6.4%</span>
            </div>
            <div className="mt-2">
              <Sparkline
                data={[2680, 2705, 2690, 2740, 2760, 2735, 2790, 2812, 2847]}
                width={420}
                height={44}
                tone="up"
                filled
                strokeWidth={1.75}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* composer */}
      <div className="mock-bar mock-edge flex items-center gap-2 rounded-pill border px-3 py-2">
        <span className="mock-ai">{AiSpark}</span>
        <span className="mock-ink-mute flex-1 text-[12px]">Ask anything about the market…</span>
        <span className="mock-on-light flex h-7 w-7 items-center justify-center rounded-pill bg-white">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────  PORTFOLIO DOCTOR MOCKUP  ───────────────────────── */

const DOCTOR_ROWS = [
  { label: 'Concentration', score: 'B+', tone: 'up', note: 'Top holding 14% of book' },
  { label: 'Sector balance', score: 'A−', tone: 'up', note: 'Well diversified' },
  { label: 'Momentum', score: 'C', tone: 'warn', note: '2 names rolling over' },
  { label: 'Drawdown risk', score: 'B', tone: 'up', note: 'Within tolerance' },
]

export function DoctorMockup() {
  return (
    <div className="mock-panel mock-edge overflow-hidden rounded-xl border">
      <div className="mock-edge flex items-center justify-between border-b px-4 py-3">
        <div>
          <div className="mock-ink text-[13px] font-semibold">Portfolio health</div>
          <div className="mock-ink-mute font-mono text-[10px] uppercase tracking-wide">Multi-agent review</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="mock-ink-mute font-mono text-[9px] uppercase tracking-wide">Overall</div>
            <div className="mock-up font-mono text-[22px] font-bold leading-none">B+</div>
          </div>
        </div>
      </div>
      <div className="mock-divide">
        {DOCTOR_ROWS.map((r, i) => (
          <div key={r.label} className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? 'mock-edge-soft border-t' : ''}`}>
            <div className="min-w-0">
              <div className="mock-ink text-[12.5px] font-medium">{r.label}</div>
              <div className="mock-ink-mute truncate text-[10.5px]">{r.note}</div>
            </div>
            <span
              className={`ml-3 inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 font-mono text-[12px] font-bold ${
                r.tone === 'warn' ? 'mock-warn mock-warn-tint' : 'mock-up mock-up-tint'
              }`}
            >
              {r.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
