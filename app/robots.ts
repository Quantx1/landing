import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantx.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Sentry tunnel route — not content.
      disallow: ['/monitoring'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
