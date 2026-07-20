/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ---------- Bundle Optimization ----------
  // Tree-shake Lucide icons (only import what's used)
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{ kebabCase member }}',
    },
  },
  // Enable gzip + brotli compression in production
  compress: true,
  // Reduce output size by not including source maps in production
  productionBrowserSourceMaps: false,
  // Optimize package imports for heavy libraries
  experimental: {
    optimizePackageImports: ['recharts', 'date-fns', 'framer-motion'],
  },
  
  // ---------- Security headers ----------
  // NOTE: this repo has no middleware.ts. The nonce-based CSP described here
  // lives in the frontend repo and did not come across in the landing
  // carve-out, so **no Content-Security-Policy is currently set on this
  // site** — only the static headers below. Port frontend/middleware.ts here
  // if the marketing site needs CSP too.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ]
      }
    ]
  },
  
  // Proxy API requests to the backend in local development.
  //
  // Cloudflare migration notes:
  //
  //  1. The `/ws/:path*` rewrite was REMOVED. Cloudflare Workers do not carry
  //     an HTTP `Upgrade` handshake through the Next.js router, so proxying a
  //     WebSocket through a rewrite cannot work there. Clients must connect
  //     to the backend origin directly via NEXT_PUBLIC_WS_URL, which means
  //     the backend needs CORS for this site's origin.
  //
  //  2. The build-time `throw` was downgraded to a warning. It existed to stop
  //     a production build whose rewrites would silently point at localhost.
  //     But landing's data components are all client-side with swallowed
  //     errors (see IndexTicker.tsx / TrackRecordBar.tsx), so the site renders
  //     fine with no backend — it just shows empty widgets. Hard-failing would
  //     block deploying the marketing site before the API exists.
  //
  // With NEXT_PUBLIC_API_URL set to an absolute URL, lib/api.ts talks to the
  // backend directly and these rewrites are never exercised in production.
  async rewrites() {
    const explicit = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
    if (!explicit && process.env.NODE_ENV === 'production') {
      console.warn(
        '\n[next.config] NEXT_PUBLIC_API_URL is not set for this production ' +
        'build.\nThe site will render, but every live-data widget (ticker, ' +
        'track record,\nproof panels) will be empty and the OG image will be ' +
        'degraded.\nSet it in the Cloudflare Worker build environment once the ' +
        'backend is live.\n'
      )
      return []
    }
    const backendUrl = explicit || 'http://localhost:8000'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },

  // Allow TradingView images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tradingview.com',
      },
      {
        protocol: 'https',
        hostname: 's3.tradingview.com',
      },
    ],
  },
}

// PR-V — wrap with Sentry. ``withSentryConfig`` injects sourcemap
// upload + the necessary webpack hooks. If @sentry/nextjs isn't
// installed (e.g. CI without devDeps) we fall back to the plain
// config so the build still succeeds.
try {
  const { withSentryConfig } = require('@sentry/nextjs')
  module.exports = withSentryConfig(nextConfig, {
    // Suppress all Sentry-CLI output unless an auth token is present;
    // most local builds don't have one and the noise is misleading.
    silent: !process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Don't upload source maps in dev — wasted bandwidth + slow rebuilds.
    disableLogger: true,
    sourcemaps: {
      disable: !process.env.SENTRY_AUTH_TOKEN,
    },
    // Tunnel through /monitoring so ad-blockers don't drop traces.
    // No-op when DSN unset.
    tunnelRoute: '/monitoring',
  })
} catch (_err) {
  module.exports = nextConfig
}
