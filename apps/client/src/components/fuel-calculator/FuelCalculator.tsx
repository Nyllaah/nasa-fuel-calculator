import { useCallback, useEffect, useRef, useState } from 'react'
import { Satellite } from 'lucide-react'
import type { FuelResponse, Planet } from '@nasa-fuel/shared'
import { canPlaceWaypointAt, canPlacePlanetAnywhere, wouldRemoveWaypointCreateSamePlanetLeg } from '@nasa-fuel/shared'
import { ui } from '@/constants/ui'
import { errors } from '@/constants/errors'
import { ConnectionIndicator } from '@/components/fuel-calculator/ConnectionIndicator'
import { PlanetPalette, WaypointStrip } from '@/components/fuel-calculator/FlightPathBuilder'
import { MassInput } from '@/components/fuel-calculator/MassInput'
import { ResultsPanel } from '@/components/fuel-calculator/ResultsPanel'
import { StarField } from '@/components/fuel-calculator/StarField'
import { useFuelCalculator } from '@/hooks/useFuelCalculator'
import { pointToRectDist } from '@/lib/format'
import { isFuelError, isFuelResponse } from '@/lib/parseFuelMessage'
import { isWaypointRouteReady, isWaypointsComplete, waypointsToFlightPath } from '@/lib/waypoints'

function FuelCalculator() {
  const { mass, setMass, setFlightPath, result, status, error, isCalculating } = useFuelCalculator()

  const [waypoints, setWaypoints] = useState<(Planet | null)[]>([null, null])
  const [dragging, setDragging] = useState<Planet | null>(null)
  const [nearZone, setNearZone] = useState<number | null>(null)

  const zoneRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isWaypointRouteReady(waypoints)) {
      setFlightPath(waypointsToFlightPath(waypoints))
      return
    }

    setFlightPath([])
  }, [waypoints, setFlightPath])

  const checkProximity = useCallback(
    (point: { x: number; y: number }): number | null => {
      const buffer = 50

      for (let index = 0; index < waypoints.length; index++) {
        const element = zoneRefs.current[index]
        if (!element) continue

        const rect = element.getBoundingClientRect()
        if (pointToRectDist(point, rect) < buffer) return index
      }

      return null
    },
    [waypoints.length],
  )

  const handleDragStart = useCallback((planet: Planet) => {
    setDragging(planet)
    setNearZone(null)
  }, [])

  const handleDrag = useCallback(
    (_planet: Planet, point: { x: number; y: number }) => {
      setNearZone(checkProximity(point))
    },
    [checkProximity],
  )

  const handleDragEnd = useCallback(
    (planet: Planet, point: { x: number; y: number }) => {
      const index = checkProximity(point)

      if (index !== null && canPlaceWaypointAt(waypoints, index, planet)) {
        setWaypoints((previous) => {
          const next = [...previous]
          next[index] = planet
          return next
        })
      }

      setDragging(null)
      setNearZone(null)
    },
    [checkProximity, waypoints],
  )

  const planetUseCount = useCallback(
    (planet: Planet) => waypoints.filter((waypoint) => waypoint === planet).length,
    [waypoints],
  )

  const canUsePlanet = useCallback(
    (planet: Planet) => canPlacePlanetAnywhere(waypoints, planet),
    [waypoints],
  )

  const allFilled = isWaypointsComplete(waypoints)
  const routeInvalid = allFilled && !isWaypointRouteReady(waypoints)

  const fuelResult: FuelResponse | null = result && isFuelResponse(result) ? result : null

  const displayError =
    error ??
    (routeInvalid ? errors.SAME_PLANET_LEG : null) ??
    (result && isFuelError(result) ? result.error : null)

  return (
    <div className="fc-shell fc-no-spinners">
      <StarField />

      <header className="fc-header">
        <div className="flex items-center gap-2.5">
          <Satellite size={20} className="text-[#00d4ff]" />
          <span className="fc-title">{ui.APP_TITLE}</span>
        </div>

        <ConnectionIndicator status={status} />
      </header>

      <main className="fc-main">
        <div className="col-span-full">
          <PlanetPalette
            planetUseCount={planetUseCount}
            canUsePlanet={canUsePlanet}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        </div>

        <WaypointStrip
          waypoints={waypoints}
          dragging={dragging}
          nearZone={nearZone}
          zoneRefs={zoneRefs}
          planetUseCount={planetUseCount}
          canUsePlanet={canUsePlanet}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onClearWaypoint={(index) =>
            setWaypoints((previous) => {
              const next = [...previous]
              next[index] = null
              return next
            })
          }
          onRemoveWaypoint={(index) => {
            if (wouldRemoveWaypointCreateSamePlanetLeg(waypoints, index)) return

            setWaypoints((previous) => {
              const next = previous.filter((_, waypointIndex) => waypointIndex !== index)
              zoneRefs.current = zoneRefs.current.slice(0, next.length)
              return next
            })
          }}
          onAddWaypoint={() => setWaypoints((previous) => [...previous, null])}
        />

        <div className="fc-sidebar">
          <MassInput mass={mass} onMassChange={setMass} />
          <div className="flex-1">
            <ResultsPanel
              result={fuelResult}
              error={displayError}
              allFilled={allFilled}
              isCalculating={isCalculating}
              status={status}
            />
          </div>
        </div>

        <p className="fc-footer">
          {ui.FOOTER_PREFIX}{' '}
          <span className="fc-footer-accent">{ui.FOOTER_ADD_STOP}</span> {ui.FOOTER_SUFFIX}
        </p>
      </main>
    </div>
  )
}

export { FuelCalculator }
