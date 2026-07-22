import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LegalMarkdown } from '@/components/legal/LegalMarkdown'
import { HomeFooter } from '@/components/home/HomeFooter'

// slug → (file, human title). Draft docs live in content/legal/ and are read at
// build time (SSG), so there is no runtime filesystem access on the server.
const DOCS: Record<string, { file: string; title: string }> = {
  terms: { file: 'terms-of-service.md', title: 'Terms of Service' },
  privacy: { file: 'privacy-policy.md', title: 'Privacy Policy' },
  disclaimer: { file: 'disclaimer.md', title: 'Disclaimer' },
  risk: { file: 'risk-disclosure.md', title: 'Risk Disclosure' },
  refund: { file: 'refund-policy.md', title: 'Refund & Cancellation Policy' },
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = DOCS[params.slug]
  return { title: doc ? `${doc.title} | Quant X` : 'Legal | Quant X' }
}

function readDoc(file: string): string {
  try {
    return readFileSync(join(process.cwd(), 'content', 'legal', file), 'utf8')
  } catch {
    return ''
  }
}

export default function LegalDocPage({ params }: { params: { slug: string } }) {
  const doc = DOCS[params.slug]
  if (!doc) notFound()
  const content = readDoc(doc.file)

  return (
    <main className="min-h-screen bg-main px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/legal" className="text-[13px] text-d-text-muted transition-colors hover:text-primary">← All policies</Link>

        {content ? (
          <article className="mt-6">
            <LegalMarkdown content={content} />
          </article>
        ) : (
          <p className="mt-10 text-d-text-secondary">This document is being prepared.</p>
        )}

        <div className="mt-14 border-t border-line pt-6 text-[12px] text-d-text-muted">
          Draft template — pending review by a SEBI-registered legal/compliance professional. Not legal advice.
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-1">
        <HomeFooter />
      </div>
    </main>
  )
}
