import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, Loader2 } from 'lucide-react'
import type { FuelResponse } from '@nasa-fuel/shared'
import { PlanetOrb } from '@/components/fuel-calculator/PlanetOrb'
import type { ConnectionStatus } from '@/hooks/useWebSocket'
import { actionLabel, ui } from '@/constants/ui'
import { formatKg } from '@/lib/format'
import { PLANET_CONFIG } from '@/lib/planetConfig'
import { cn } from '@/lib/utils'

type ResultsPanelProps = {
  result: FuelResponse | null
  error: string | null
  allFilled: boolean
  isCalculating: boolean
  status: ConnectionStatus
}

function ResultsPanel({
  result,
  error,
  allFilled,
  isCalculating,
  status,
}: ResultsPanelProps) {
  const empty = !allFilled
  const offline = allFilled && status !== 'connected'

  return (
    <div className={cn('fc-panel', isCalculating && result && 'fc-panel-loading')}>
      {result && !error && !isCalculating && <div className="fc-scanline" aria-hidden />}

      <div className="fc-label">
        <Activity size={14} className="text-[#00d4ff]" />
        {ui.MISSION_ANALYSIS}
        {isCalculating && (
          <span className="fc-calculating-badge">
            <Loader2 size={12} className="animate-spin" />
            {ui.CALCULATING}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <AlertTriangle size={20} className="text-red-500" />
            <span className="fc-error">{error}</span>
          </motion.div>
        ) : offline ? (
          <motion.p
            key="offline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fc-body"
          >
            {ui.WAITING_CONNECTION}
          </motion.p>
        ) : empty ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fc-body"
          >
            {ui.SELECT_ROUTE_PROMPT}
          </motion.p>
        ) : result ? (
          <motion.div
            key={String(result.totalFuel)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('flex flex-col gap-4', isCalculating && 'opacity-60')}
          >
            <div className="text-center">
              <p className="fc-fuel-label">{ui.TOTAL_PROPELLANT}</p>
              <p className="fc-fuel-total">{formatKg(result.totalFuel)}</p>
              <p className="fc-fuel-meta">
                {ui.KG} &nbsp;·&nbsp; {(result.totalFuel / 1000).toFixed(1)} {ui.TONS}
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/6 pt-3.5">
              <p className="fc-section-title">{ui.STEP_BREAKDOWN}</p>
              {result.breakdown.map((step, index) => {
                const config = PLANET_CONFIG[step.planet]
                const isLaunch = step.action === 'launch'

                return (
                  <div key={`${step.action}-${step.planet}-${index}`} className="fc-step-row">
                    <PlanetOrb planet={step.planet} size={28} />
                    <div className="flex-1">
                      <p
                        className={cn(
                          'fc-step-action',
                          isLaunch ? 'text-amber-500' : 'text-[#00d4ff]',
                        )}
                      >
                        {actionLabel(step.action)} · {config.label}
                      </p>
                    </div>
                    <p className="fc-step-fuel">{formatKg(step.fuel)} kg</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : isCalculating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5"
          >
            <Loader2 size={18} className="animate-spin text-[#00d4ff]" />
            <span className="fc-body">{ui.CALCULATING}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export { ResultsPanel }
