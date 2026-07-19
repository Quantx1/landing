"use client"

/**
 * Landing scroll-reveal primitives (v2 "Refined Expressive").
 *
 * One motion vocabulary for the whole page: a gentle blur-fade-up as
 * elements enter the viewport. Tuned per the review-animations STANDARDS:
 *   • ease-out custom curve (starts fast, feels responsive),
 *   • 0.5s for marketing reveals, 6px travel + 6px blur mask,
 *   • `whileInView once` (fires on a visible default, never gates content
 *     behind a class that won't run on a headless render),
 *   • 30-80ms stagger between siblings via <RevealGroup>.
 *
 * Reduced motion: framer-motion's global <MotionConfig reducedMotion="user">
 * already strips transforms; we additionally collapse to a plain fade so
 * the content is never hidden.
 */

import { type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion"

// Strong ease-out (cubic-bezier(0.16, 1, 0.3, 1)), the marketing variant
// of the emil-design-eng UI curve. Slightly longer tail for elegance.
const EASE_OUT = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds of delay before this element reveals. */
  delay?: number
  /** Travel distance in px (default 14). */
  y?: number
  /** Reveal duration in seconds (default 0.5). */
  duration?: number
  as?: "div" | "section" | "li" | "article" | "span"
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.5,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as]

  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -60px 0px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  )
}

/**
 * Stagger container, children passed as <RevealItem> animate in sequence
 * (60ms apart by default) once the group enters the viewport. Parent +
 * children share one client tree so framer's staggerChildren works.
 */
const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

export function RevealGroup({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "li" | "article"
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      variants={reduce ? itemVariantsReduced : itemVariants}
    >
      {children}
    </Comp>
  )
}
