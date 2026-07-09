import type { FlightStep, Planet } from '@nasa-fuel/shared'

function waypointsToFlightPath(waypoints: Planet[]): FlightStep[] {
  const flightPath: FlightStep[] = []

  for (let i = 0; i < waypoints.length - 1; i++) {
    flightPath.push({ action: 'launch', planet: waypoints[i] })
    flightPath.push({ action: 'land', planet: waypoints[i + 1] })
  }

  return flightPath
}

function isWaypointsComplete(waypoints: (Planet | null)[]): waypoints is Planet[] {
  return waypoints.length >= 2 && waypoints.every((waypoint) => waypoint !== null)
}

export { waypointsToFlightPath, isWaypointsComplete }
