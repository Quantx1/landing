import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache'
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue'

/**
 * Cloudflare Workers deployment config for the landing site.
 *
 * The only thing in this app that needs the incremental cache is the OG image
 * route (`app/opengraph-image.tsx`, `revalidate = 600`). There are no route
 * handlers, no Server Actions and no on-demand revalidation
 * (revalidateTag/revalidatePath) anywhere in the repo, so the tag cache is
 * deliberately not configured — add `tagCache` here if that changes.
 *
 * KV is used instead of OpenNext's recommended R2 because R2 is not enabled
 * on this Cloudflare account. KV is eventually consistent, so a revalidated
 * OG card may serve stale briefly. See the note in wrangler.jsonc for how to
 * move to R2 once it's switched on.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: doQueue,
})
