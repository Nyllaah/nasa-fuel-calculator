import { Fragment, useEffect, useRef } from 'react'
import { Plus, Rocket } from 'lucide-react'
import type { Planet } from '@nasa-fuel/shared'
import { canPlaceWaypointAt } from '@nasa-fuel/shared'
import { ui } from '@/constants/ui'
import { DraggablePlanetCard } from '@/components/fuel-calculator/DraggablePlanetCard'
import { DropZone } from '@/components/fuel-calculator/DropZone'
import { PLANETS } from '@/lib/planetConfig'
import { cn } from '@/lib/utils'

type DragHandlers = {
  planetUseCount: (planet: Planet) => number
  canUsePlanet: (planet: Planet) => boolean
  onDragStart: (planet: Planet) => void
  onDrag: (planet: Planet, point: { x: number; y: number }) => void
  onDragEnd: (planet: Planet, point: { x: number; y: number }) => void
}

type PlanetPaletteProps = DragHandlers

function PlanetPalette({
  planetUseCount,
  canUsePlanet,
  onDragStart,
  onDrag,
  onDragEnd,
}: PlanetPaletteProps) {
  return (
    <div className="fc-palette">
      <span className="fc-palette-label">{ui.CELESTIAL_BODIES}</span>
      <div className="fc-divider-r" />
      <div className="flex gap-3">
        {PLANETS.map((planet) => (
          <DraggablePlanetCard
            key={planet}
            planet={planet}
            useCount={planetUseCount(planet)}
            canUse={canUsePlanet(planet)}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
      <div className="fc-divider-l" />
    </div>
  )
}

type WaypointStripProps = DragHandlers & {
  waypoints: (Planet | null)[]
  dragging: Planet | null
  nearZone: number | null
  zoneRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onClearWaypoint: (index: number) => void
  onRemoveWaypoint: (index: number) => void
  onAddWaypoint: () => void
}

function WaypointStrip({
  waypoints,
  dragging,
  nearZone,
  zoneRefs,
  onClearWaypoint,
  onRemoveWaypoint,
  onAddWaypoint,
}: WaypointStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
  }, [waypoints.length])

  return (
    <div className="fc-waypoint-section">
      <div className="fc-label">
        <Rocket size={12} className="text-white/30" />
        {ui.FLIGHT_PATH_CONFIG}
      </div>

      <div ref={scrollRef} className="fc-waypoint-scroll">
        {waypoints.map((planet, index) => {
          const canDrop =
            dragging !== null && nearZone === index && canPlaceWaypointAt(waypoints, index, dragging)
          const invalidDrop =
            dragging !== null &&
            nearZone === index &&
            !canPlaceWaypointAt(waypoints, index, dragging)

          return (
          <Fragment key={index}>
            <div className="fc-waypoint-stop">
              <DropZone
                index={index}
                totalStops={waypoints.length}
                planet={planet}
                isHovered={canDrop}
                isInvalidHover={invalidDrop}
                zoneRef={(element) => {
                  zoneRefs.current[index] = element
                }}
                onClear={() => onClearWaypoint(index)}
                onRemove={waypoints.length > 2 ? () => onRemoveWaypoint(index) : undefined}
              />
            </div>

            {index < waypoints.length - 1 && (
              <div className="fc-connector">
                {[0, 1, 2].map((marker) => (
                  <div
                    key={marker}
                    className={cn(
                      'fc-connector-marker',
                      waypoints[index] && waypoints[index + 1] ? 'opacity-90' : 'opacity-25',
                    )}
                  />
                ))}
              </div>
            )}
          </Fragment>
          )
        })}

        {waypoints.length < 6 && (
          <div className="flex shrink-0 items-center pl-3">
            <button type="button" onClick={onAddWaypoint} className="fc-add-stop">
              <Plus size={18} />
              {ui.ADD_STOP}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { PlanetPalette, WaypointStrip }
export type { DragHandlers }
