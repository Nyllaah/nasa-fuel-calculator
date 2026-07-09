import { motion, useMotionValue, type PanInfo } from 'framer-motion'
import type { Planet } from '@nasa-fuel/shared'
import { PlanetOrb } from '@/components/fuel-calculator/PlanetOrb'
import { PLANET_CONFIG } from '@/lib/planetConfig'
import { cn } from '@/lib/utils'

type DraggablePlanetCardProps = {
  planet: Planet
  useCount: number
  canUse: boolean
  onDragStart: (planet: Planet) => void
  onDrag: (planet: Planet, point: { x: number; y: number }) => void
  onDragEnd: (planet: Planet, point: { x: number; y: number }) => void
}

function DraggablePlanetCard({
  planet,
  useCount,
  canUse,
  onDragStart,
  onDrag,
  onDragEnd,
}: DraggablePlanetCardProps) {
  const config = PLANET_CONFIG[planet]
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const isDimmed = !canUse

  return (
    <motion.div
      drag={canUse}
      style={{ x, y }}
      className={cn(
        'select-none',
        canUse ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed',
      )}
      dragElastic={0.15}
      dragMomentum={false}
      whileDrag={{ scale: 1.12, zIndex: 50 }}
      onDragStart={() => onDragStart(planet)}
      onDrag={(_event: PointerEvent, info: PanInfo) => onDrag(planet, info.point)}
      onDragEnd={(_event: PointerEvent, info: PanInfo) => {
        x.set(0)
        y.set(0)
        onDragEnd(planet, info.point)
      }}
    >
      <div
        tabIndex={canUse ? 0 : -1}
        className={cn(
          'fc-planet-card',
          isDimmed ? 'fc-planet-card-dimmed' : 'fc-planet-card-active',
        )}
      >
        <PlanetOrb planet={planet} size={56} glow={!isDimmed} dim={isDimmed} />
        <span
          className={cn(
            'fc-planet-name',
            isDimmed ? 'text-white/30' : 'text-white/85',
          )}
        >
          {config.label}
        </span>
        {useCount > 0 && <div className="fc-use-badge">{useCount}</div>}
      </div>
    </motion.div>
  )
}

export { DraggablePlanetCard }
