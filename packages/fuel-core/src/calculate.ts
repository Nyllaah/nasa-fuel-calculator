import type { Action, FlightStep, FuelBreakdownStep, FuelResponse, Planet } from '@nasa-fuel/shared';
import { GRAVITY } from '@nasa-fuel/shared';

export function stepFuel(mass: number, action: Action, planet: Planet): number {
  const gravity = GRAVITY[planet];
  const raw =
    action === 'launch' ? mass * gravity * 0.042 - 33 : mass * gravity * 0.033 - 42;
  return Math.floor(raw);
}

export function recursiveFuel(mass: number, action: Action, planet: Planet): number {
  const base = stepFuel(mass, action, planet);
  if (base <= 0) {
    return 0;
  }

  const additional = recursiveFuel(base, action, planet);
  if (additional <= 0) {
    return base;
  }

  return base + additional;
}

export function calculateFuel(mass: number, flightPath: FlightStep[]): FuelResponse {
  let runningMass = mass;
  let totalFuel = 0;
  const breakdown: FuelBreakdownStep[] = [];

  for (const step of [...flightPath].reverse()) {
    const fuel = recursiveFuel(runningMass, step.action, step.planet);
    breakdown.unshift({ ...step, fuel });
    totalFuel += fuel;
    runningMass += fuel;
  }

  return { total_fuel: totalFuel, breakdown };
}
