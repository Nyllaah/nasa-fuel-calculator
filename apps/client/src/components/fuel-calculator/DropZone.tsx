import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Rocket, Satellite, X } from 'lucide-react'
import type { Planet } from '@nasa-fuel/shared'
import { stopLabel, ui } from '@/constants/ui'
import { PlanetOrb } from '@/components/fuel-calculator/PlanetOrb'
import { PLANET_CONFIG } from '@/lib/planetConfig'
import { cn } from '@/lib/utils'

function stopAccent(index: number, total: number): { color: string; rgb: string } {
  if (index === 0) return { color: '#f59e0b', rgb: '245 158 11' }
  if (index === total - 1) return { color: '#00d4ff', rgb: '0 212 255' }
  return { color: '#a855f7', rgb: '168 85 247' }
}

const CORNER_CLASS = {
  tl: 'top-2 left-2 border-t-2 border-l-2',
  tr: 'top-2 right-2 border-t-2 border-r-2',
  bl: 'bottom-2 left-2 border-b-2 border-l-2',
  br: 'bottom-2 right-2 border-b-2 border-r-2',
} as const

type DropZoneProps = {
  index: number
  totalStops: number
  planet: Planet | null
  isHovered: boolean
  zoneRef: (element: HTMLDivElement | null) => void
  onClear: () => void
  onRemove?: () => void
}

function DropZone({
  index,
  totalStops,
  planet,
  isHovered,
  zoneRef,
  onClear,
  onRemove,
}: DropZoneProps) {
  const { color: accentColor, rgb: accentRgb } = stopAccent(index, totalStops)
  const label = stopLabel(index, totalStops)

  const zoneStyle = {
    '--fc-accent': accentColor,
    '--fc-accent-rgb': accentRgb,
  } as CSSProperties

  const emptyIcon =
    index === 0 ? (
      <Rocket size={22} className="text-white/15" />
    ) : index === totalStops - 1 ? (
      <Satellite size={22} className="text-white/15" />
    ) : (
      <MapPin size={22} className="text-white/15" />
    )

  return (
    <div
      ref={zoneRef}
      style={zoneStyle}
      className={cn(
        'fc-dropzone',
        planet && 'fc-dropzone-filled',
        isHovered && 'fc-dropzone-hovered',
      )}
    >
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <div
          key={corner}
          className={cn(
            'fc-corner',
            CORNER_CLASS[corner],
            planet || isHovered ? 'opacity-80' : 'opacity-30',
          )}
        />
      ))}

      <p className="fc-dropzone-label">{label}</p>

      <AnimatePresence mode="wait">
        {planet ? (
          <motion.div
            key={planet}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="flex flex-col items-center gap-2.5"
          >
            <PlanetOrb planet={planet} size={64} glow />
            <span className="fc-planet-name-lg">{PLANET_CONFIG[planet].label}</span>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="fc-planet-slot">{emptyIcon}</div>
            <span className="fc-drop-hint">
              {isHovered ? ui.RELEASE_TO_SELECT : ui.DROP_PLANET_HERE}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {planet && (
        <button type="button" onClick={onClear} className="fc-icon-btn" title={ui.CLEAR_PLANET}>
          <X size={11} />
        </button>
      )}

      {onRemove && (
        <button type="button" onClick={onRemove} className="fc-remove-btn" title={ui.REMOVE_STOP}>
          <X size={8} /> {ui.REMOVE_STOP_SHORT}
        </button>
      )}
    </div>
  )
}

export { DropZone }
