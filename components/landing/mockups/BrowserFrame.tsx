'use client'

/**
 * BrowserFrame, a reusable mac-style window chrome that wraps our REAL
 * product UI to present it as a polished product mockup (category-standard
 * framed product renders).
 *
 * Honesty contract: this frames our actual product components rendered with
 * representative values, it is a product render, NOT live data and NOT a
 * performance claim. Copy across the page never states fabricated returns
 * (SEBI), so the render reads as "this is the product", not "these are results".
 *
 * Design language (high-end-visual-design "double-bezel"): an outer machined
 * shell (subtle bg + hairline ring + small padding + larger radius) holds an
 * inner core (the window) with its own surface, a traffic-light titlebar and
 * an address pill. Pinned to the dark surface via .dark-media so the framed
 * screenshot reads as an intentional dark product render on BOTH themes.
 */

import type { ReactNode } from 'react'

interface Props {
  /** The address-bar label, e.g. "quantx.app/signals". */
  url?: string
  /** Window content, our real product components with sample data. */
  children: ReactNode
  /** Extra classes on the outer shell. */
  className?: string
  /** Content padding inside the window. */
  bodyClassName?: string
  /** A floating chip rendered top-right of the shell (e.g. "Sample data"). */
  badge?: ReactNode
}

export function BrowserFrame({ url = 'quantx.app', children, className = '', bodyClassName = 'p-4 sm:p-5', badge }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* AI/data depth pool behind the frame (subtle, emerald→violet) */}
      <div aria-hidden className="bg-radial-glow absolute -inset-6 -z-10 opacity-90" />

      {/* Outer machined shell (double-bezel) */}
      <div className="dark-media relative rounded-3xl border p-1.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)]">
        {/* Inner core: the window */}
        <div className="mock-window mock-edge overflow-hidden rounded-[1.15rem] border">
          {/* Titlebar */}
          <div className="mock-bar mock-edge flex items-center gap-3 border-b px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="mock-tl-red h-2.5 w-2.5 rounded-full" />
              <span className="mock-tl-amber h-2.5 w-2.5 rounded-full" />
              <span className="mock-tl-green h-2.5 w-2.5 rounded-full" />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <span className="mock-surface-05 mock-ink-dim inline-flex max-w-full items-center gap-1.5 truncate rounded-pill px-3 py-1 font-mono text-[10.5px] tracking-tight">
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="4" y="9" width="16" height="11" rx="2" />
                  <path d="M8 9V7a4 4 0 0 1 8 0v2" />
                </svg>
                <span className="truncate">{url}</span>
              </span>
            </div>
            {/* spacer to balance the dots so the url stays centered */}
            <div className="w-[42px]" aria-hidden />
          </div>

          {/* Window body, the real product UI lives here */}
          <div className={`relative ${bodyClassName}`}>{children}</div>
        </div>
      </div>

      {badge && (
        <div className="absolute -right-3 -top-3 z-10">{badge}</div>
      )}
    </div>
  )
}
