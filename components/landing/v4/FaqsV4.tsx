'use client'

/**
 * FaqsV4 — landing blueprint item 12 (FintechX 12-tail-c.jpeg).
 *
 * Two-column FAQ band on a WHITE section (pad 0 0 100px per SPECIMENS):
 * left = eyebrow pill + Bricolage H2 + lead + tinted "Still have
 * questions?" card (avatar cluster + black pill CTA); right = 6-question
 * accordion of FLAT TINTED rounded-[30px] pad-40px items (bg-main, no
 * border, no shadow — template does flat tinted cards) with a rotating
 * plus glyph and height-animated answers.
 *
 * Token classes only (no raw hexes); light-pinned page but theme-safe.
 * Motion: whileInView fade/rise per spec §6 (0.5s, ease [0.22,1,0.36,1],
 * 60ms stagger); accordion collapses to opacity-only under reduced motion.
 */

import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { ArrowRight, Plus } from '@/lib/icons'

const EASE = [0.22, 1, 0.36, 1] as const

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

interface FaqEntry {
  question: string
  answer: string
}

const FAQS: FaqEntry[] = [
  {
    question: 'Is Quant X investment advice?',
    answer:
      'No. Quant X is a research and education platform. Every signal is a model output that has cleared a backtest gate, shown with its full reasoning — not a personalised recommendation, and never a promise of returns. Markets carry risk, and every decision stays yours.',
  },
  {
    question: 'Is it safe to connect my broker?',
    answer:
      'Yes. Quant X links to Zerodha, Upstox and Angel One through official OAuth — we never see your password and never hold your funds. Your money stays in your broker account, access is revocable anytime, and a one-tap kill-switch halts all activity instantly.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We skip refunds in favour of something better: a Free plan with no time limit. Screen stocks, study signals and paper trade for as long as you like — upgrade only once Quant X has earned it, and cancel a paid plan whenever you choose.',
  },
  {
    question: 'Where does your market data come from?',
    answer:
      'End-of-day NSE data across 2,385 listed stocks and 34 indices, plus live quotes streamed through your own broker connection once linked. Every input the engines read is traceable — no black-box feeds.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes — one click in Settings, no lock-in, no questions asked. Your plan stays active until the end of the billing cycle, after which you move to the Free plan and keep your watchlists and history.',
  },
  {
    question: 'Can I practise without real money?',
    answer:
      "That's the default. Paper trading ships on the Free plan — all five engines run on a virtual portfolio with real market data, so you can watch every signal play out before a single rupee is at stake.",
  },
]

/* Monogram stand-ins for the template's photo avatars (no stock photos). */
const AVATARS = [
  { initial: 'A', className: 'bg-primary/15 text-primary' },
  { initial: 'N', className: 'bg-cyan/15 text-cyan' },
  { initial: 'S', className: 'bg-d-text-primary text-wrap' },
] as const

interface FaqRowProps {
  entry: FaqEntry
  index: number
  open: boolean
  reduce: boolean
  variants: Variants
  onToggle: (index: number) => void
}

function FaqRow({ entry, index, open, reduce, variants, onToggle }: FaqRowProps) {
  const buttonId = `faq-v4-trigger-${index}`
  const panelId = `faq-v4-panel-${index}`

  return (
    <motion.li
      variants={variants}
      className="overflow-hidden rounded-[30px] bg-main"
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(index)}
          className="flex w-full items-center justify-between gap-6 p-7 text-left sm:p-10"
        >
          <span className="text-lg font-semibold leading-snug text-d-text-primary">
            {entry.question}
          </span>
          {/* Rotate the wrapper span, not the SVG itself. */}
          <span
            aria-hidden
            className={`shrink-0 text-d-text-primary transition-transform duration-300 ${
              open ? 'rotate-45' : 'rotate-0'
            }`}
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="-mt-2 max-w-prose px-7 pb-7 text-base font-medium leading-relaxed text-d-text-secondary sm:-mt-4 sm:px-10 sm:pb-10">
              {entry.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export function FaqsV4() {
  const reduce = useReducedMotion() ?? false
  const item = reduce ? fadeVariants : riseVariants
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index))

  return (
    /* Template rhythm: FAQs section pad 0 0 100px on white. */
    <section id="faqs" className="bg-wrap pb-20 pt-0 md:pb-[100px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        {/* ── Left: heading + "still have questions" card ─────────── */}
        <motion.div
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="self-start lg:sticky lg:top-24"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center rounded-full bg-main px-4 py-1.5 text-sm font-semibold text-d-text-secondary"
          >
            FAQ
          </motion.span>

          <motion.h2
            variants={item}
            className="heading-display mt-5 text-4xl leading-[1.15] text-d-text-primary md:text-5xl md:leading-[1.15]"
          >
            Frequently asked questions
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 max-w-sm text-lg font-medium leading-relaxed text-d-text-secondary"
          >
            Quick answers to common questions about the platform, pricing and
            safety.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 rounded-[30px] bg-main p-7 sm:p-10"
          >
            <div className="flex items-center">
              <div className="flex -space-x-2.5">
                {AVATARS.map(({ initial, className }) => (
                  <span
                    key={initial}
                    aria-hidden
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-main ${className}`}
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <span aria-hidden className="mx-2.5 text-lg font-medium text-d-text-muted">
                +
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground">
                You
              </span>
            </div>

            <h3 className="heading-display mt-6 text-2xl text-d-text-primary sm:text-[1.75rem]">
              Still have questions?
            </h3>
            <p className="mt-2 text-base font-medium leading-relaxed text-d-text-secondary">
              Reach out, and our team will guide you.
            </p>

            <a
              href="mailto:support@quantx.app"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-d-text-primary py-2 pl-6 pr-2 text-base font-semibold text-wrap transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              Talk to our team
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wrap text-d-text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right: accordion ────────────────────────────────────── */}
        <motion.ul
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-5 md:space-y-[30px]"
        >
          {FAQS.map((entry, index) => (
            <FaqRow
              key={entry.question}
              entry={entry}
              index={index}
              open={openIndex === index}
              reduce={reduce}
              variants={item}
              onToggle={handleToggle}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
