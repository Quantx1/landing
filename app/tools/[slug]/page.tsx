import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolView } from '@/components/tools/ToolView'
import { TOOLS, getTool } from '@/lib/tools/registry'

/**
 * Server component so each tool gets its own <title>/<meta description> and is
 * prerendered at build time. The interactive calculator is a client child.
 */

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug)
  if (!tool) return {}

  const url = `/tools/${tool.slug}`
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
  }
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug)
  if (!tool) notFound()

  // FAQPage structured data — makes the Q&A eligible for rich results.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ToolView tool={tool} />
    </>
  )
}
