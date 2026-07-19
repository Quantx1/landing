'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X as XIcon, Zap, Shield, Star, ArrowRight, Loader2, ChevronDown, Sparkles } from '@/lib/icons'
import { toast } from 'sonner'
import { api, handleApiError } from '@/lib/api'
import {
  type DeltaVariant,
  quizRecCopy,
  quizRecDelta,
  quizRecReason,
  tierRank,
} from '@/lib/tierUpsell'
import LightNavbar from '@/components/landing/LightNavbar'
import Footer from '@/components/landing/Footer'
import FeatureComparisonMatrix from '@/components/pricing/FeatureComparisonMatrix'

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

interface Plan {
  id: string
  name: string
  display_name: string
  description: string
  price_monthly: number
  price_quarterly: number
  price_yearly: number
  max_signals_per_day: number
  max_positions: number
  max_capital: number
  signal_only: boolean
  semi_auto: boolean
  full_auto: boolean
  equity_trading: boolean
  futures_trading: boolean
  options_trading: boolean
  telegram_alerts: boolean
  priority_support: boolean
  api_access: boolean
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

/* ========================================================================== */
/* STATIC FALLBACK PLANS (shown while API loads)                              */
/* ========================================================================== */

// PR 92 — static fallback aligned to the locked Free / Pro ₹999 /
// Elite ₹1,999 tier structure. Previous values were stale: Elite was
// ₹2,499 (locked is ₹1,999), Pro Copilot cap was "50 messages/day"
// (canonical cap is 150 per copilot_daily_cap()), Free showed "5
// signals/day" (locked spec is 1/day), and Pro listed "Pattern
// detection (10 types)" + "50+ scanners" as separate items even
// though both live inside Scanner Lab post-PR-78. Feature lists also
// reordered to lead with the buying decision (signal access + Copilot
// quota + the flagship feature unlocked at each tier).
// Pricing v2 2026-06-12 — AutoPilot Lite moves to Pro (live auto-trading
// capped at ₹2L deployed); Free gets Paper AutoPilot (virtual money, same
// Lite shape). Caps printed here are the REAL backend numbers
// (LLM_FEATURE_CAPS) — never advertise a limit the API doesn't enforce.
const STATIC_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Watch the AI trade. Virtual money, zero risk.',
    icon: Sparkles,
    features: [
      'Paper AutoPilot trades a virtual portfolio for you',
      '1 swing signal / day',
      'Copilot 5 messages / day',
      'Paper trading + League',
      'Watchlist (5 symbols)',
      'Telegram daily digest',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    description: 'Trade with the AI. Or let it trade for you.',
    icon: Zap,
    popular: true,
    features: [
      'AutoPilot Lite: live auto-trading up to ₹2,00,000',
      'Unlimited swing + intraday signals',
      'Momentum Picks (weekly Top-10)',
      'AI Scanner + Setup Finder (AI thesis 30 / day)',
      'Copilot 150 messages / day',
      'WhatsApp digest + Alerts Studio',
      'Portfolio Doctor 10 / month + Weekly Review',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 1999,
    description: 'Full automation. No caps. Full depth.',
    icon: Shield,
    features: [
      'Everything in Pro',
      'AutoPilot Unlimited: no capital cap, 15 positions',
      'F&O strategies + Options Copilot',
      'Counterpoint debate on signals',
      'Copilot 400 messages / day',
      'Portfolio Doctor 60 / month',
    ],
  },
]

/* ========================================================================== */
/* FAQ ACCORDION                                                              */
/* ========================================================================== */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-d-border">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="pr-4 text-sm font-semibold text-d-text-primary">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-d-text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[300px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm leading-relaxed text-d-text-secondary">{a}</p>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* MAIN PAGE                                                                  */
/* ========================================================================== */

export default function PricingPage() {
  const router = useRouter()
  const [apiPlans, setApiPlans] = useState<Plan[]>([])
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)
  // PR 115 — surface the onboarding quiz's recommended tier as a
  // subtle banner above the plan grid. Quiz output (PR 79) is stored
  // but never shown after the result screen; this brings it to the
  // page where the buying decision actually happens. Best-effort —
  // unauthenticated visitors hit a 401 and the banner stays hidden.
  const [quizRec, setQuizRec] = useState<{
    current_tier: 'free' | 'pro' | 'elite'
    recommended_tier: 'free' | 'pro' | 'elite'
    risk_profile: 'conservative' | 'moderate' | 'aggressive' | null
  } | null>(null)
  useEffect(() => {
    let active = true
    // PR 118 — read via 5-min cache helper so /pricing + /settings + the
    // (platform) layout don't each hit the endpoint on every navigation.
    import('@/lib/onboardingStatusCache').then(({ getOnboardingStatus }) => {
      getOnboardingStatus().then((s) => {
        if (!active || !s || !s.completed || !s.recommended_tier) return
        setQuizRec({
          current_tier: s.current_tier,
          recommended_tier: s.recommended_tier,
          risk_profile: s.current_risk_profile,
        })
      })
    }).catch(() => {})
    return () => { active = false }
  }, [])

  // PR 98 — derive the real yearly discount from `apiPlans[].price_yearly`
  // vs `price_monthly * 12`. Returns 0 when the API hasn't loaded or
  // when no plan has a yearly price set (in which case the backend
  // falls back to 12× monthly = no discount, and we shouldn't claim
  // one). Take the largest discount across paid tiers so the badge
  // covers what every paid plan actually offers.
  const yearlyDiscountPct = (() => {
    let best = 0
    for (const p of apiPlans) {
      const m = Number(p.price_monthly) || 0
      const y = Number(p.price_yearly) || 0
      if (m <= 0 || y <= 0) continue
      const pct = Math.round((1 - y / (m * 12)) * 100)
      if (pct > best) best = pct
    }
    return best
  })()

  // Resolve the displayed "per month" price for a given static plan.
  // Prefers the API plan's authoritative price_yearly when available;
  // falls back to 12× monthly (= no discount) when not — never the
  // hardcoded 0.8 multiplier we used to bake in here.
  const monthlyPriceFor = (staticPlan: { id: string; name: string; price: number }) => {
    if (billingPeriod === 'monthly' || staticPlan.price === 0) return staticPlan.price
    const apiPlan = apiPlans.find((p) => p.name === staticPlan.id || p.name === staticPlan.name.toLowerCase())
    if (apiPlan && Number(apiPlan.price_yearly) > 0) {
      return Math.round(Number(apiPlan.price_yearly) / 12)
    }
    // No yearly DB row → backend bills 12× monthly. Show that honestly.
    return staticPlan.price
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  useEffect(() => {
    fetchPlans()
    fetchCurrentSubscription()
  }, [])

  const fetchPlans = async () => {
    try {
      const data = await api.payments.getPlans()
      if (data.plans) setApiPlans(data.plans as Plan[])
    } catch { /* use static fallback */ }
  }

  const fetchCurrentSubscription = async () => {
    try {
      const data = await api.user.getProfile()
      setCurrentPlan(data.subscription_plan_id)
    } catch { /* not logged in */ }
  }

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.name === 'free') return
    // PR 100 — fire UPGRADE_INITIATED before the Razorpay round-trip so
    // the conversion funnel sees the click even if checkout never opens.
    try {
      const target = (plan.name as 'pro' | 'elite') === 'elite' ? 'elite' : 'pro'
      const { reportUpgradeIntent } = await import('@/lib/reportUpgradeIntent')
      void reportUpgradeIntent(target, 'pricing_page')
    } catch {}
    setProcessingPlanId(plan.id)
    setLoading(true)
    try {
      const data = await api.payments.createOrder(plan.id, billingPeriod)
      if (!data.order_id) throw new Error('Failed to create order')
      const user = await api.user.getProfile()
      const options: RazorpayOptions = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'Quant X',
        description: `${plan.display_name} - ${billingPeriod} subscription`,
        order_id: data.order_id,
        handler: async (response: RazorpayResponse) => { await handlePaymentSuccess(response) },
        prefill: { name: user.full_name || '', email: user.email || '', contact: user.phone || '' },
        theme: { color: '#4FECCD' },
      }
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch { toast.error('Failed to initiate payment') }
    finally { setLoading(false); setProcessingPlanId(null) }
  }

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      const data = await api.payments.verify({
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      })
      if (data.success) { toast.success('Payment successful!'); router.push('/copilot') }
      else throw new Error('Payment verification failed')
    } catch { toast.error('Payment verification failed. Contact support.') }
  }

  return (
    <div className="min-h-screen bg-d-bg">
      <LightNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-dot-grid mask-radial-fade opacity-30" />
        <div className="illustration-glow-teal" style={{ top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px' }} />

        <div className="relative mx-auto max-w-4xl px-4 pb-4 pt-24 text-center sm:px-6 sm:pt-32">
          <h1 className="text-4xl font-bold tracking-tight text-d-text-primary sm:text-5xl">
            Pick Your <span className="gradient-text-teal">Trading Plan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-d-text-secondary">
            Start free. Upgrade when the AI earns it. Every plan ships the five-engine stack and hard risk controls.
          </p>
        </div>
      </section>

      {/* PR 98 — billing toggle now reads the real DB-backed yearly
          discount instead of advertising a hardcoded 20%. We compute
          the savings from `apiPlans[].price_yearly` vs `price_monthly *
          12`, take the largest discount across plans (so the badge
          claim covers every paid tier), and hide the "Save X%" badge
          when the API hasn't loaded yet — better silence than a lie. */}
      <div className="flex justify-center pb-12 pt-8">
        <div className="inline-flex items-center gap-1 rounded-full border border-d-border bg-d-bg-sidebar p-1">
          {(['monthly', 'yearly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                billingPeriod === period
                  ? 'bg-primary text-d-bg shadow-sm'
                  : 'text-d-text-secondary hover:text-d-text-primary'
              }`}
            >
              {period === 'monthly' ? 'Monthly' : 'Annual'}
              {period === 'yearly' && yearlyDiscountPct > 0 && (
                <span className="ml-2 text-xs font-semibold text-up">Save {yearlyDiscountPct}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PR 115 — onboarding quiz recommendation banner. Renders only
          when the quiz suggested a tier higher than the user's current
          plan, so we never pressure-downgrade. */}
      {quizRec && tierRank(quizRec.recommended_tier) > tierRank(quizRec.current_tier) && (
        <QuizRecommendationBanner
          recommended={quizRec.recommended_tier}
          currentTier={quizRec.current_tier}
          riskProfile={quizRec.risk_profile}
        />
      )}

      {/* Pricing Cards (static fallback or API) */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STATIC_PLANS.map((plan) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            const monthlyPrice = monthlyPriceFor(plan)
            const isCurrent = currentPlan === plan.id
            // PR 115 — outline the quiz-recommended tier card so the
            // visitor's eye lands on the right plan first.
            const isRecommended = quizRec?.recommended_tier === plan.id

            // If API plans loaded, use those for checkout
            const apiPlan = apiPlans.find((p) => p.name === plan.id || p.name === plan.name.toLowerCase())

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  isRecommended
                    ? 'border-highlight bg-d-bg-card shadow-glass-lg ring-1 ring-highlight/30'
                    : isPopular
                      ? 'border-primary bg-d-bg-card shadow-glass-lg ring-1 ring-primary/20'
                      : 'border-d-border bg-d-bg-card shadow-glass hover:shadow-glass-hover'
                }`}
              >
                {/* PR 115 — recommended takes badge precedence over
                    "popular" since it's personalized to this user. */}
                {isRecommended ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-highlight px-3 py-1 text-xs font-bold text-d-bg">
                    <Sparkles className="h-3 w-3" /> RECOMMENDED FOR YOU
                  </div>
                ) : isPopular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-d-bg">
                    <Star className="h-3 w-3" /> MOST POPULAR
                  </div>
                ) : null}

                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-d-text-primary">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-d-text-secondary">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono num-display text-4xl font-bold text-d-text-primary">
                      &#8377;{monthlyPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-d-text-muted">/mo</span>
                  </div>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <p className="mt-1 text-xs text-up">
                      Billed &#8377;{(monthlyPrice * 12).toLocaleString('en-IN')}/year
                    </p>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-d-text-secondary">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.price === 0) { router.push('/signup'); return }
                    // PR 122 — when the user clicks the highlighted
                    // (quiz-recommended) card, fire a finer-grained
                    // source slug so we can decompose the funnel and
                    // see whether the personalization is what drove
                    // the click vs the plain card click.
                    if (isRecommended && (plan.id === 'pro' || plan.id === 'elite')) {
                      import('@/lib/reportUpgradeIntent').then(({ reportUpgradeIntent }) => {
                        void reportUpgradeIntent(plan.id as 'pro' | 'elite', 'quiz_rec_card_highlight')
                      }).catch(() => {})
                    }
                    if (apiPlan) handleSelectPlan(apiPlan)
                    else router.push('/signup')
                  }}
                  disabled={loading && processingPlanId === plan.id}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                    isCurrent
                      ? 'cursor-not-allowed bg-hover text-d-text-muted'
                      : plan.price === 0
                      ? 'border border-d-border bg-d-bg-card text-d-text-primary hover:bg-hover'
                      : 'bg-primary text-d-bg hover:bg-primary-hover hover:shadow-glow-primary'
                  }`}
                >
                  {loading && processingPlanId === plan.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    <>
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-d-text-muted">
          {[
            { icon: Shield, label: 'Razorpay Secure' },
            { icon: Check, label: 'Cancel Anytime' },
            { icon: Check, label: 'GST Invoice' },
            { icon: Check, label: '7-Day Free Trial' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2">
              <badge.icon className="h-4 w-4 text-up" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison — Step 4 §5.1.2 full matrix, grouped + collapsible */}
      <div className="border-t border-d-border bg-d-bg-sidebar">
        <FeatureComparisonMatrix />
      </div>

      {/* FAQ — Step 4 §5.1.2: 8-10 items, tier / broker / SEBI / kill-switch / data */}
      <section className="py-20 border-t border-d-border">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-d-text-primary">Questions, answered straight</h2>
          {[
            {
              q: 'Is Quant X a SEBI-registered investment advisor?',
              a: 'No. SEBI registration is pending. Quant X is an educational and research tool: we surface AI-generated analysis, you make the call. Signals are not personalized investment advice. Auto-trading runs on your own broker account, under your risk settings and SEBI margin rules. We never hold your funds.',
            },
            {
              q: 'How is my money protected?',
              a: 'We never hold your capital. Broker tokens are encrypted with AES-256 (Fernet) before storage. Hit the kill switch any time to pause every bit of automation: per-user (Settings, Kill switch) or platform-wide (we run a global kill in case of infra failure).',
            },
            {
              q: 'Do I need to connect a broker to sign up?',
              a: 'No. Sign up free, get a ₹10,00,000 virtual paper portfolio, and let Paper AutoPilot trade it for you. No broker needed. You only connect a broker when you go live on Pro or Elite.',
            },
            {
              q: 'Which brokers are supported?',
              a: 'Zerodha (Kite Connect), Upstox (v2 API), Angel One (SmartAPI). One-click OAuth, so we never see your broker password. Kite Connect is a paid Zerodha product (₹2,000/month) billed by Zerodha directly. Upstox and Angel One API access is free.',
            },
            {
              q: 'What is AutoPilot Lite vs AutoPilot Unlimited?',
              a: 'Same engine, different capital ceiling. Lite (Pro) auto-trades your broker account with up to ₹2,00,000 deployed across max 8 positions, equity only. Unlimited (Elite) drops the capital cap, holds up to 15 positions, and adds F&O strategies. On Free, the same engine trades virtual money so you can judge it before you pay. AutoPilot is supervised: hard stops stay authoritative. Going from paper to live is always an explicit step. Upgrading your plan never starts real-money trading on its own.',
            },
            {
              q: 'Can I upgrade or downgrade my plan?',
              a: 'Upgrade any time, you pay only the prorated difference. Downgrades kick in at the end of the current billing cycle, so you keep full access until then. Cancellation stops the next renewal. No lock-in.',
            },
            {
              q: 'How accurate are the AI signals?',
              a: 'No cherry-picking. Every closed signal is published on our public /proof page with real P&L, wins and losses both. Each underlying model has live accuracy stats on the same page, refreshed weekly. Targets depend on signal type and regime and vary with market conditions; every signal can lose and markets carry risk.',
            },
            {
              q: 'What happens if the AI is wrong?',
              a: 'It will be wrong sometimes. Every signal ships with a stop loss. Risk per trade is capped to your risk profile (Conservative / Moderate / Aggressive). Regime gates the book: bear-regime signals are auto-sized down 50%. Set daily / weekly / monthly loss caps in Settings and they trip the kill switch for you.',
            },
            {
              q: 'Do I pay tax on paper-trading results?',
              a: 'No. Paper trading is simulated, so no P&L is realized for tax purposes. Live trading on Pro / Elite generates real P&L, subject to STT and short-term / long-term capital gains tax under Indian tax law. We give you a trade journal CSV for your CA.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'UPI, credit and debit cards, net banking, and wallets, all through Razorpay. GST is charged separately on the base price. Invoices hit your inbox instantly.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel whenever you like — you keep full access through the end of the period you have already paid for, and you are never charged again after that. You can also downgrade to Free at any time at no charge. No lock-in.',
            },
          ].map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}


/* ───────────────────────── PR 115 — quiz recommendation ───────────────────────── */
//
// `tierRank`, `quizRecCopy`, `quizRecReason`, `quizRecDelta` live in
// `@/lib/tierUpsell` so /settings TierPanel renders the same headline,
// reason copy, and A/B delta bullets without the two surfaces drifting.

function QuizRecommendationBanner({
  recommended,
  currentTier,
  riskProfile,
}: {
  recommended: 'free' | 'pro' | 'elite'
  currentTier: 'free' | 'pro' | 'elite'
  riskProfile: 'conservative' | 'moderate' | 'aggressive' | null
}) {
  if (recommended === 'free') return null  // upsell-only — never downgrade
  // PR 119 — per-session dismiss. Once the user closes the banner we
  // hide it for the rest of the tab session, but it returns next visit
  // (or after a quiz retake — invalidate is keyed by tier).
  const [dismissed, setDismissed] = useState(false)
  // PR 121 — expand state. Default collapsed so the banner stays
  // compact for users who already know what they're buying; one click
  // reveals the 3-bullet delta for users who want the comparison.
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    let active = true
    import('@/lib/quizRecDismiss').then(({ isQuizRecDismissed }) => {
      if (!active) return
      setDismissed(isQuizRecDismissed(recommended as 'pro' | 'elite'))
    }).catch(() => {})
    return () => { active = false }
  }, [recommended])
  if (dismissed) return null
  const copy = quizRecCopy(recommended)!
  // PR 120 — fall back to the generic feature pitch when the quiz didn't
  // capture a risk profile (older quiz responses, schema gaps).
  const reason = quizRecReason(recommended, riskProfile)
  const body = reason ?? copy.pitch
  // PR 123 — pick A/B variant. Stable per user across reloads via
  // localStorage anon id; once authed, the user_id arms takes over but
  // the bucket function is the same so the variant rarely flips.
  const [variant, setVariant] = useState<DeltaVariant>('feature_led')
  useEffect(() => {
    // PR 127 — `currentTier` is a prop and the parent only mounts this
    // banner after the quiz status fetch settles, so tier is always
    // known by the time we run. No async tier-load gating needed.
    let active = true
    Promise.all([
      import('@/lib/abVariant'),
      import('@/lib/supabase').then((m) => m.supabase.auth.getUser()),
    ]).then(([mod, userResp]) => {
      if (!active) return
      const uid = userResp?.data?.user?.id ?? null
      const v = mod.getVariant('quiz_rec_delta_copy', ['feature_led', 'outcome_led'] as const, uid)
      setVariant(v)
      void mod.reportExposure('quiz_rec_delta_copy', v, {
        current_tier: currentTier,
      })
    }).catch(() => {})
    return () => { active = false }
  }, [currentTier])
  const deltaBullets = quizRecDelta(currentTier, recommended, variant)
  const onDismiss = () => {
    setDismissed(true)
    import('@/lib/quizRecDismiss').then(({ dismissQuizRec }) => {
      dismissQuizRec(recommended as 'pro' | 'elite')
    }).catch(() => {})
  }
  return (
    <section className="mx-auto max-w-5xl px-4 mt-2 mb-2 sm:px-6">
      <div
        className="relative rounded-xl border px-5 py-4 pr-12"
        style={{
          borderColor: 'rgba(255,209,102,0.35)',
          background: 'linear-gradient(135deg, rgba(255,209,102,0.08) 0%, rgba(255,209,102,0.02) 100%)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,209,102,0.14)', border: '1px solid rgba(255,209,102,0.40)' }}
            >
              <Sparkles className="w-4 h-4 text-highlight" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-d-text-primary">
                Based on your onboarding quiz: <span className="text-highlight">{copy.name}</span> recommended
                {riskProfile && (
                  <span className="text-d-text-muted font-normal text-[12px] ml-2 capitalize">
                    · {riskProfile} risk profile
                  </span>
                )}
              </p>
              <p className="text-[12px] text-d-text-secondary mt-0.5 leading-relaxed">
                {body}
              </p>
              {deltaBullets && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !expanded
                    setExpanded(next)
                    // PR 122 — track expand only (collapse isn't intent).
                    // PR 123 — tag with A/B variant so per-arm conversion
                    // is decomposable in the funnel report.
                    if (next && (recommended === 'pro' || recommended === 'elite')) {
                      import('@/lib/reportUpgradeIntent').then(({ reportUpgradeIntent }) => {
                        void reportUpgradeIntent(recommended, 'quiz_rec_what_changes', variant)
                      }).catch(() => {})
                    }
                  }}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-highlight hover:text-d-text-primary transition-colors"
                  aria-expanded={expanded}
                >
                  {expanded ? 'Hide' : 'What changes for you'}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
          <Link
            href="/onboarding/risk-quiz"
            className="text-[11px] text-d-text-muted hover:text-d-text-primary whitespace-nowrap"
          >
            Retake quiz →
          </Link>
        </div>
        {expanded && deltaBullets && (
          <ul className="mt-3 ml-12 space-y-1.5">
            {deltaBullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[12px] text-d-text-secondary leading-relaxed">
                <Check className="w-3 h-3 text-highlight mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss recommendation"
          className="absolute top-2 right-2 p-1 rounded text-d-text-muted hover:text-d-text-primary hover:bg-surface-2"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  )
}
