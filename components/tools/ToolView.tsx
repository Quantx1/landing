'use client'

/**
 * Maps a tool slug to its calculator. Kept separate from the route so the
 * page itself can stay a server component and own `generateMetadata`.
 */

import { ToolShell } from './ToolShell'
import type { Tool } from '@/lib/tools/registry'
import {
  BrokerageCalculator, PositionSizeCalculator,
  RiskRewardCalculator, PivotPointCalculator,
} from './calculators/trading'
import {
  SipCalculator, LumpsumCalculator, CagrCalculator, GoalSipCalculator,
} from './calculators/returns'
import {
  AveragePriceCalculator, MarginCalculator,
  ProfitLossCalculator, CapitalGainsCalculator,
} from './calculators/portfolio'

const CALCULATORS: Record<string, () => JSX.Element> = {
  'brokerage-calculator': BrokerageCalculator,
  'position-size-calculator': PositionSizeCalculator,
  'risk-reward-calculator': RiskRewardCalculator,
  'pivot-point-calculator': PivotPointCalculator,
  'sip-calculator': SipCalculator,
  'lumpsum-calculator': LumpsumCalculator,
  'cagr-calculator': CagrCalculator,
  'goal-sip-calculator': GoalSipCalculator,
  'average-price-calculator': AveragePriceCalculator,
  'margin-calculator': MarginCalculator,
  'profit-loss-calculator': ProfitLossCalculator,
  'capital-gains-tax-calculator': CapitalGainsCalculator,
}

export function ToolView({ tool }: { tool: Tool }) {
  const Calculator = CALCULATORS[tool.slug]
  if (!Calculator) return null
  return (
    <ToolShell tool={tool}>
      <Calculator />
    </ToolShell>
  )
}
