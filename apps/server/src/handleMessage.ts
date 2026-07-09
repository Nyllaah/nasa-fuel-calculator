import { calculateFuel } from '@nasa-fuel/fuel-core'
import type { FuelMessage } from '@nasa-fuel/shared'
import { validateRequest } from './validate.js'

export function handleMessage(raw: string): FuelMessage {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    return { error: 'Invalid JSON' }
  }

  const validated = validateRequest(parsed)

  if (typeof validated === 'string') {
    return { error: validated }
  }

  return calculateFuel(validated.mass, validated.flightPath)
}
