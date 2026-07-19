# Quant X — Landing

Next.js marketing/legal site: `/` (home), `/pricing`, `/privacy`, `/terms`, `/proof` (+ model & track-record subpages).

Part of the [Quantx1](https://github.com/Quantx1) org: **landing** · [frontend](https://github.com/Quantx1/frontend) · [backend](https://github.com/Quantx1/backend) · [ml](https://github.com/Quantx1/ml)

Extracted from the frontend app with its full import graph, so the `@/` alias layout matches the product app. Live trust data (indices ticker, track record) comes read-only from the backend's public endpoints.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
```

Required env: `NEXT_PUBLIC_API_URL` (build fails without it), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Run

```bash
npm run dev     # dev server on :3000
npm run build   # production build
```

## Deploy

Deploy the repo root on Vercel (auto-detected). Serve this on the apex domain; the product app ([frontend](https://github.com/Quantx1/frontend)) handles everything behind login — its CTAs point users there.
