/**
 * LegalMarkdown — a tiny, dependency-free Markdown renderer for the legal
 * pages (no react-markdown, no raw-HTML injection — every node is real JSX).
 * Handles the subset our drafts use: headings, paragraphs, ordered/unordered
 * lists, blockquotes, horizontal rules, tables, and inline bold / links / code.
 * Server component — parsing happens at render/build, no client JS.
 */

import type { ReactNode } from 'react'

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g
const LINK = /\[([^\]]+)\]\(([^)]+)\)/

function renderInline(text: string, kp: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of Array.from(text.matchAll(INLINE))) {
    const idx = m.index ?? 0
    if (idx > last) out.push(text.slice(last, idx))
    const tok = m[0]
    if (tok.startsWith('**')) {
      out.push(<strong key={`${kp}-b${i}`} className="font-semibold text-d-text-primary">{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('`')) {
      out.push(<code key={`${kp}-c${i}`} className="rounded bg-wrap px-1 py-0.5 font-mono text-[0.88em]">{tok.slice(1, -1)}</code>)
    } else {
      const mm = tok.match(LINK)
      if (mm) {
        const href = mm[2]
        const ext = /^https?:/.test(href)
        out.push(
          <a
            key={`${kp}-l${i}`}
            href={href}
            className="text-primary underline underline-offset-2 hover:opacity-80"
            {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {mm[1]}
          </a>,
        )
      } else {
        out.push(tok)
      }
    }
    last = idx + tok.length
    i++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const BLOCK_START = /^(#{1,6}\s|>\s?|\s*[-*]\s|\s*\d+\.\s|\|)/
const HR = /^\s*([-*_])\1\1+\s*$/

export function LegalMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  const key = () => `b${blocks.length}`

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    if (HR.test(line)) { blocks.push(<hr key={key()} className="my-8 border-line" />); i++; continue }

    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const level = h[1].length
      const k = key()
      const cls =
        level === 1 ? 'heading-display text-2xl sm:text-3xl mt-2 mb-4 text-d-text-primary'
        : level === 2 ? 'heading-display text-lg sm:text-xl mt-10 mb-3 text-d-text-primary'
        : 'text-[15px] font-semibold mt-6 mb-2 text-d-text-primary'
      const inner = renderInline(h[2], k)
      blocks.push(
        level <= 1 ? <h1 key={k} className={cls}>{inner}</h1>
        : level === 2 ? <h2 key={k} className={cls}>{inner}</h2>
        : level === 3 ? <h3 key={k} className={cls}>{inner}</h3>
        : <h4 key={k} className={cls}>{inner}</h4>,
      )
      i++; continue
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++ }
      const k = key()
      blocks.push(
        <blockquote key={k} className="my-6 rounded-r-lg border-l-2 border-primary/60 bg-wrap/60 px-4 py-3 text-[13px] text-d-text-secondary">
          {renderInline(buf.join(' '), k)}
        </blockquote>,
      )
      continue
    }

    // table: header row followed by a |---|---| separator
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      const rows: string[] = []
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++ }
      const cells = (r: string) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const head = cells(rows[0])
      const body = rows.slice(2).map(cells)
      const k = key()
      blocks.push(
        <div key={k} className="my-6 overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>{head.map((c, ci) => <th key={ci} className="border-b border-line bg-wrap px-3 py-2 text-left font-semibold text-d-text-primary">{renderInline(c, `${k}h${ci}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>{row.map((c, ci) => <td key={ci} className="border-b border-line/60 px-3 py-2 align-top text-d-text-secondary">{renderInline(c, `${k}r${ri}c${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++ }
      const k = key()
      blocks.push(<ul key={k} className="my-4 list-disc space-y-1.5 pl-6 text-[13.5px] text-d-text-secondary">{items.map((it, ii) => <li key={ii}>{renderInline(it, `${k}i${ii}`)}</li>)}</ul>)
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++ }
      const k = key()
      blocks.push(<ol key={k} className="my-4 list-decimal space-y-1.5 pl-6 text-[13.5px] text-d-text-secondary">{items.map((it, ii) => <li key={ii}>{renderInline(it, `${k}i${ii}`)}</li>)}</ol>)
      continue
    }

    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i]) && !HR.test(lines[i])) { buf.push(lines[i]); i++ }
    const k = key()
    blocks.push(<p key={k} className="my-3 text-[13.5px] leading-relaxed text-d-text-secondary">{renderInline(buf.join(' '), k)}</p>)
  }

  return <div className="legal-prose">{blocks}</div>
}
