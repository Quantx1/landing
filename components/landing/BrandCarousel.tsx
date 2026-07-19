'use client'

/**
 * BrandCarousel, broker-integration row.
 *
 * Honest framing: these are the brokers Quant X connects to via direct
 * OAuth (Plane-1 live data + AutoPilot execution), NOT a fabricated
 * "trusted by N traders" social-proof wall. Each shows its real logo
 * (logo service + monogram fallback) next to the name. The marquee
 * animates, pauses on hover, and collapses to static under reduced-motion.
 */

import { BrandLogo } from '@/components/ui/BrandLogo'

const brokers: { name: string; domain: string }[] = [
  { name: 'Zerodha', domain: 'zerodha.com' },
  { name: 'Upstox', domain: 'upstox.com' },
  { name: 'Angel One', domain: 'angelone.in' },
  { name: 'Fyers', domain: 'fyers.in' },
  { name: 'Groww', domain: 'groww.in' },
  { name: 'ICICI Direct', domain: 'icicidirect.com' },
  { name: 'Dhan', domain: 'dhan.co' },
]

export default function BrandCarousel() {
  return (
    <div className="marquee-pause relative overflow-hidden mask-edge-fade">
      <div
        className="flex w-max items-center gap-10 whitespace-nowrap animate-marquee"
        style={{ ['--marquee-duration' as string]: '38s' }}
      >
        {[...brokers, ...brokers].map((b, i) => (
          <span
            key={`${b.name}-${i}`}
            className="inline-flex shrink-0 items-center gap-2.5 text-[15px] font-medium tracking-tight text-d-text-secondary"
          >
            <BrandLogo domain={b.domain} alt={b.name} size={24} shape="rounded-md" />
            {b.name}
          </span>
        ))}
      </div>
    </div>
  )
}
