import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from '@/lib/icons'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/foundation'
import { ENGINES, getEngineBySlug } from '@/lib/engines'
import type { EngineTier } from '@/lib/engines'

const TIER_TONE: Record<EngineTier, 'primary' | 'warning' | 'muted'> = {
  production: 'primary',
  shadow: 'muted',
  training: 'warning',
}

const TIER_LABEL: Record<EngineTier, string> = {
  production: 'Live',
  shadow: 'Shadow',
  training: 'Training',
}

export function generateStaticParams() {
  return ENGINES.map((e) => ({ slug: e.slug }))
}

/**
 * /proof/models/[slug] — PUBLIC per-engine accuracy page.
 *
 * Re-homed from /models/[slug] in WP-CONSOLIDATE 3d (the three public
 * trust pages folded into /proof). Mirror of the authed /engines/[slug]
 * detail page but stripped to disclosure-only content (no internal
 * prediction stream, no retrain controls). Crawlable + SSG (see
 * generateStaticParams above), used in the trust-moat narrative.
 */
export default function PublicModelPage({
  params,
}: {
  params: { slug: string }
}) {
  const engine = getEngineBySlug(params.slug)
  if (!engine) notFound()

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <Link
        href="/proof?tab=models"
        className="inline-flex items-center gap-1 text-xs text-d-text-muted transition-colors hover:text-d-text-primary"
      >
        <ChevronLeft className="h-3 w-3" />
        Models
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-d-text-primary">
            {engine.name}
          </h1>
          <Badge tone={TIER_TONE[engine.tier]}>{TIER_LABEL[engine.tier]}</Badge>
        </div>
        <p className="text-sm text-d-text-secondary">{engine.tagline}</p>
        <p className="max-w-3xl text-sm text-d-text-muted">
          {engine.description}
        </p>
      </header>

      <Card>
        <CardHeader>{engine.metric}</CardHeader>
        <CardBody className="space-y-3">
          <p className="font-mono text-3xl text-d-text-primary">
            {engine.accuracy}
          </p>
          <p className="text-[11px] text-d-text-muted">
            Walk-forward, out-of-sample. Transaction costs applied where
            applicable. Methodology in the disclosures below.
          </p>
        </CardBody>
      </Card>

      <Tabs defaultValue="rolling">
        <TabsList>
          <TabsTrigger value="rolling">12-month rolling</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="data">Training data</TabsTrigger>
        </TabsList>

        <TabsContent value="rolling" className="mt-4">
          <Card>
            <CardBody>
              <Skeleton h="280px" rounded="lg" />
              <p className="mt-3 text-[11px] text-d-text-muted">
                Aggregated weekly by the model_rolling_performance job.
              </p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="methodology" className="mt-4">
          <Card>
            <CardBody className="space-y-3 text-sm text-d-text-secondary">
              <p>
                Walk-forward evaluation: model trained on rolling 5-year
                window, evaluated on next 12 months out-of-sample, then
                refit and stepped forward.
              </p>
              <p>
                Transaction costs applied per backtest harness defaults
                (0.05% slippage + 0.03% brokerage + 0.1% STT on sells).
              </p>
              <p>
                Statistical significance: 2-tailed test against permuted
                labels, p &lt; 0.05 required for the engine to graduate
                from shadow to production.
              </p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <Card>
            <CardBody className="space-y-2 text-sm text-d-text-secondary">
              <p>
                <span className="font-mono text-xs text-d-text-muted">
                  Model:
                </span>{' '}
                {engine.model}
              </p>
              <p>
                <span className="font-mono text-xs text-d-text-muted">
                  Cadence:
                </span>{' '}
                {engine.cadence}
              </p>
              <p className="text-[11px] text-d-text-muted">
                Training corpus, feature set, and evaluation universe per
                engine documented in the methodology paper (link in
                disclosures).
              </p>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardBody className="text-[11px] text-d-text-muted">
          Past performance does not guarantee future returns. Quant X operates as
          a technology platform; SEBI Research Analyst registration is pending.
          This is educational/research information, not investment advice. See the
          full disclosure at{' '}
          <Link href="/terms" className="text-primary hover:text-primary-hover">
            /terms
          </Link>
          .
        </CardBody>
      </Card>
    </div>
  )
}
