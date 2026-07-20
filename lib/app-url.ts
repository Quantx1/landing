/**
 * Landing → app URL resolution.
 *
 * Post monorepo-split the landing site and the product app are separate
 * deployments on separate origins. Marketing surfaces (nav, engine bento,
 * feature sections, footer) advertise product routes — /signals, /stocks,
 * /assistant, /scanner-lab — that do NOT exist in `landing/app`. Left as
 * bare relative paths they resolve against the marketing origin and 404.
 *
 * Everything the landing site actually owns stays relative: the 12 free
 * calculators under /tools, /pricing, /proof, /privacy, /terms.
 *
 * NEXT_PUBLIC_APP_URL is the product app origin (no trailing slash), e.g.
 * https://app.quantx.app. Left unset (local single-origin dev) links stay
 * relative and behave exactly as they did before the split.
 */

const RAW = process.env.NEXT_PUBLIC_APP_URL ?? ''

/** Product app origin, trailing slash stripped. Empty string when unset. */
export const APP_URL = RAW.replace(/\/+$/, '')

/**
 * Absolute URL for a product-app route.
 *
 * `appUrl('/signals')` → `https://app.quantx.app/signals`, or `/signals`
 * when NEXT_PUBLIC_APP_URL is unset.
 */
export function appUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${APP_URL}${p}`
}
