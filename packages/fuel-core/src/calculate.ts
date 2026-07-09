import type { Action, FlightStep, FuelBreakdownStep, FuelResponse, Planet } from '@nasa-fuel/shared'
import { GRAVITY } from '@nasa-fuel/shared'

type FuelFormula = {
  multiplier: number
  offset: number
}

const FUEL_FORMULA = new Map<Action, FuelFormula>([
  ['launch', { multiplier: 0.042, offset: 33 }],
  ['land', { multiplier: 0.033, offset: 42 }],
])

export function stepFuel(mass: number, action: Action, planet: Planet): number {
  const gravity = GRAVITY[planet]
  const { multiplier, offset } = FUEL_FORMULA.get(action)!
  const raw = mass * gravity * multiplier - offset
  return Math.floor(raw)
}

export function recursiveFuel(mass: number, action: Action, planet: Planet): number {
  const base = stepFuel(mass, action, planet)
  if (base <= 0) {
    return 0
  }

  const additional = recursiveFuel(base, action, planet)
  if (additional <= 0) {
    return base
  }

  return base + additional
}

export function calculateFuel(mass: number, flightPath: FlightStep[]): FuelResponse {
  let runningMass = mass
  let totalFuel = 0
  const breakdown: FuelBreakdownStep[] = []

  for (const step of [...flightPath].reverse()) {
    const fuel = recursiveFuel(runningMass, step.action, step.planet)
    breakdown.unshift({ ...step, fuel })
    totalFuel += fuel
    runningMass += fuel
  }

  return { totalFuel, breakdown }
}
