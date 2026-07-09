import type { FlightStep, Planet } from './types.js'

function hasSamePlanetLeg(planets: readonly Planet[]): boolean {
  for (let index = 0; index < planets.length - 1; index++) {
    if (planets[index] === planets[index + 1]) return true
  }

  return false
}

function hasSamePlanetLegInFlightPath(flightPath: FlightStep[]): boolean {
  for (let index = 0; index < flightPath.length - 1; index++) {
    const current = flightPath[index]
    const next = flightPath[index + 1]

    if (current.action === 'launch' && next.action === 'land' && current.planet === next.planet) {
      return true
    }
  }

  return false
}

function canPlaceWaypointAt(
  waypoints: readonly (Planet | null)[],
  index: number,
  planet: Planet,
): boolean {
  const previous = index > 0 ? waypoints[index - 1] : null
  const following = index < waypoints.length - 1 ? waypoints[index + 1] : null

  if (previous === planet) return false
  if (following === planet) return false

  return true
}

function canPlacePlanetAnywhere(waypoints: readonly (Planet | null)[], planet: Planet): boolean {
  return waypoints.some((_, index) => canPlaceWaypointAt(waypoints, index, planet))
}

function wouldRemoveWaypointCreateSamePlanetLeg(
  waypoints: readonly (Planet | null)[],
  indexToRemove: number,
): boolean {
  if (waypoints.length <= 2) return false

  const previous = indexToRemove > 0 ? waypoints[indexToRemove - 1] : null
  const following = indexToRemove < waypoints.length - 1 ? waypoints[indexToRemove + 1] : null

  return previous !== null && following !== null && previous === following
}

export {
  hasSamePlanetLeg,
  hasSamePlanetLegInFlightPath,
  canPlaceWaypointAt,
  canPlacePlanetAnywhere,
  wouldRemoveWaypointCreateSamePlanetLeg,
}
