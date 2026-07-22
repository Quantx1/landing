import Link from 'next/link'
import { ChevronLeft } from '@/lib/icons'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EyebrowMono,
  Skeleton,
} from '@/components/foundation'

/**
 * /proof/track-record/[id] — public per-signal P&L breakdown.
 *
 * Re-homed from /track-record/[id] in WP-CONSOLIDATE 3d (the three public
 * trust pages folded into /proof). Closed signals from the last 90 days,
 * with multi-engine consensus at entry and the actual realised P&L. Used
 * as the trust-moat exhibit on the landing page + during sales
 * conversations. (Content still a stub — wired to real data in Plan 3.)
 */
export default async function TrackRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <Link
        href="/proof?tab=track-record"
        className="inline-flex items-center gap-1 text-xs text-d-text-muted transition-colors hover:text-d-text-primary"
      >
        <ChevronLeft className="h-3 w-3" />
        Track record
      </Link>

      <header className="space-y-1">
        <EyebrowMono>Closed signal · {id}</EyebrowMono>
        <h1 className="heading-display text-2xl font-normal text-d-text-primary">
          <Skeleton w="220px" h="28px" className="inline-block" />
        </h1>
        <p className="text-sm text-d-text-muted">
          Published, monitored, and closed by Quant X. Every metric below
          is real and verifiable from our signals log.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Entry', tone: 'muted' as const },
          { label: 'Exit', tone: 'muted' as const },
          { label: 'Hold', tone: 'muted' as const },
          { label: 'Realised P&L', tone: 'primary' as const },
        ].map(({ label, tone }) => (
          <Card key={label}>
            <CardBody className="space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-d-text-muted">
                {label}
              </p>
              <Skeleton w="70%" h="18px" />
              {label === 'Realised P&L' && (
                <Badge tone={tone}>Outcome</Badge>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>AI thesis at entry</CardHeader>
        <CardBody className="space-y-2">
          <Skeleton h="14px" />
          <Skeleton h="14px" w="85%" />
          <Skeleton h="14px" w="70%" />
          <Skeleton h="14px" w="55%" />
          <p className="mt-2 text-[11px] text-d-text-muted">
            Plan 3 wires this to the AI-written thesis captured at
            signal-publish time. The thesis is a single plain-English
            paragraph — no per-engine breakdown.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Price chart with entry + exit markers</CardHeader>
        <CardBody>
          <Skeleton h="320px" rounded="sm" />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="text-[11px] text-d-text-muted">
          Disclosures: actual fills may differ from entry/exit by slippage.
          Past performance does not guarantee future returns. See{' '}
          <Link href="/terms" className="text-primary hover:text-primary-hover">
            /terms
          </Link>
          .
        </CardBody>
      </Card>
    </div>
  )
}
