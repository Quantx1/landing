'use client'

/**
 * LightNavbar, v2 "Refined Expressive" marketing nav.
 *
 * Sticky, hairline, single-line at desktop (≤ 72px). Logo · Products
 * mega-menu · anchor links · live regime pill · theme toggle · Log in
 * (ghost) · Get started (signature pill). Mobile collapses to a sheet.
 *
 * Data wiring preserved: the live regime pill + 30-day transition strip
 * read `api.publicTrust.regimeHistory(30)` (unauth, CDN-cached). Brand
 * firewall: copy names only the 5 public engines, never model architectures.
 */

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  TrendingUp,
  ScanLine,
  BarChart3,
  Brain,
  Target,
  Zap,
  ChevronDown,
  Receipt,
  Crosshair,
  Repeat,
} from '@/lib/icons'
import { api } from '@/lib/api'
import { ThemeToggleCompact } from '@/components/theme/ThemeToggle'
import { appUrl } from '@/lib/app-url'

/* ── Product mega-menu items (real routes preserved) ── */
const productGroups = [
  {
    title: 'AI Signals',
    items: [
      { icon: TrendingUp, label: 'Trading Signals', desc: 'AI entry / exit with stop-loss', href: appUrl('/signals') },
      { icon: Target, label: 'Momentum Picks', desc: 'Alpha top-10 weekly', href: appUrl('/momentum') },
      { icon: Zap, label: 'AI Swing Signal', desc: 'High-conviction setups', href: appUrl('/swingmax-signal') },
    ],
  },
  {
    title: 'AI Scanner',
    items: [
      { icon: ScanLine, label: 'Pattern Scanner', desc: '11 chart patterns, 1,800+ stocks', href: appUrl('/scanner-lab?tab=patterns') },
      { icon: BarChart3, label: 'Stock Screener', desc: '50+ real-time scanners', href: appUrl('/scanner-lab?tab=screeners') },
      { icon: Brain, label: 'Stock Browser', desc: 'NSE-wide list with live regime', href: appUrl('/stocks') },
    ],
  },
  {
    title: 'Free tools',
    items: [
      { icon: Receipt, label: 'Brokerage Calculator', desc: 'STT, GST and real break-even', href: '/tools/brokerage-calculator' },
      { icon: Crosshair, label: 'Position Size', desc: 'Share quantity from your risk', href: '/tools/position-size-calculator' },
      { icon: Repeat, label: 'All 12 calculators', desc: 'SIP, CAGR, capital gains and more', href: '/tools' },
    ],
  },
]

const navLinks = [
  { label: 'Engines', href: '#engines' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Track record', href: '/proof?tab=track-record' },
]

type RegimeName = 'bull' | 'sideways' | 'bear'

const REGIME_PILL: Record<RegimeName, { label: string; color: string }> = {
  bull:     { label: 'Bull',     color: 'var(--color-up)' },
  sideways: { label: 'Sideways', color: 'var(--color-warning)' },
  bear:     { label: 'Bear',     color: 'var(--color-down)' },
}

export default function LightNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [regime, setRegime] = useState<{ name: RegimeName; conf: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let active = true
    api.publicTrust
      .regimeHistory(7)
      .then((r) => {
        if (!active) return
        const cur = (r as any)?.current
        if (cur?.regime) {
          const name = String(cur.regime).toLowerCase() as RegimeName
          if (['bull', 'sideways', 'bear'].includes(name)) {
            const confKey = `prob_${name}` as 'prob_bull' | 'prob_sideways' | 'prob_bear'
            setRegime({ name, conf: Number(cur[confKey] || 0) })
          }
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setProductsOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProductsOpen(false), 180)
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-line bg-main/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-gradient-signature flex h-7 w-7 items-center justify-center rounded-[7px]">
            <span className="font-display text-[15px] font-bold text-on-signature">Q</span>
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-d-text-primary">Quant X</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 md:flex">
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium text-d-text-secondary transition-colors hover:text-d-text-primary">
              Products
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
            </button>

            {productsOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-[660px] rounded-2xl border border-line bg-wrap p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] animate-pop-in">
                  <div className="grid grid-cols-3 gap-5">
                    {productGroups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-d-text-muted">
                          {group.title}
                        </p>
                        <div className="space-y-0.5">
                          {group.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setProductsOpen(false)}
                              className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-hover"
                            >
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-main text-d-text-secondary transition-colors group-hover:text-d-text-primary">
                                <item.icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-medium text-d-text-primary">{item.label}</span>
                                <span className="block text-[11px] leading-snug text-d-text-muted">{item.desc}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                    <p className="text-[11px] text-d-text-muted">Five AI engines. 50+ scanners. 11 chart patterns.</p>
                    <Link
                      href="#engines"
                      onClick={() => setProductsOpen(false)}
                      className="text-[11px] font-medium text-d-text-primary hover:opacity-70"
                    >
                      See the stack &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-[13px] font-medium text-d-text-secondary transition-colors hover:text-d-text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA cluster */}
        <div className="hidden items-center gap-2.5 md:flex">
          {regime && (
            <Link
              href="/proof?tab=regime"
              className="hidden items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-medium lg:inline-flex"
              style={{
                color: REGIME_PILL[regime.name].color,
                borderColor: `color-mix(in srgb, ${REGIME_PILL[regime.name].color} 40%, transparent)`,
                background: `color-mix(in srgb, ${REGIME_PILL[regime.name].color} 9%, transparent)`,
              }}
              title="Live market regime, open the full regime view"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: REGIME_PILL[regime.name].color }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: REGIME_PILL[regime.name].color }} />
              </span>
              {REGIME_PILL[regime.name].label}
              <span className="numeric opacity-80">{Math.round(regime.conf * 100)}%</span>
            </Link>
          )}
          <ThemeToggleCompact />
          <Link
            href="/login"
            className="rounded-pill px-3.5 py-2 text-[13px] font-medium text-d-text-secondary transition-colors hover:text-d-text-primary"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-gradient-cta inline-flex items-center rounded-pill px-4 py-2 text-[13px] font-semibold text-on-signature transition-transform active:scale-[0.97]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-d-text-secondary transition-colors hover:text-d-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t border-line bg-main/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {productGroups.flatMap((g) => g.items).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium text-d-text-secondary transition-colors hover:text-d-text-primary"
              >
                <item.icon className="h-4 w-4 text-d-text-muted" />
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-[14px] font-medium text-d-text-secondary transition-colors hover:text-d-text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 border-t border-line pt-3">
              <Link
                href="/login"
                className="rounded-pill px-3 py-2.5 text-center text-[14px] font-medium text-d-text-secondary"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-cta rounded-pill px-5 py-2.5 text-center text-[14px] font-semibold text-on-signature"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
