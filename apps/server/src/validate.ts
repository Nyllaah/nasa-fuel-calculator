import type { ZodError } from 'zod'
import { fuelRequestSchema, hasSamePlanetLegInFlightPath } from '@nasa-fuel/shared'
import type { FuelRequest } from '@nasa-fuel/shared'
import { errors } from './constants/errors.js'

function formatZodError(error: ZodError): string {
  const issue = error.issues[0]

  if (!issue) {
    return errors.INVALID_PAYLOAD
  }

  if (issue.path[0] === 'mass') {
    return errors.INVALID_MASS
  }

  if (issue.path[0] === 'flightPath' && issue.code === 'too_small') {
    return errors.EMPTY_FLIGHT_PATH
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'action') {
    return errors.INVALID_ACTION(String(issue.received))
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'planet') {
    return errors.INVALID_PLANET(String(issue.received))
  }

  return errors.INVALID_PAYLOAD
}

export function validateRequest(data: unknown): FuelRequest | string {
  const result = fuelRequestSchema.safeParse(data)

  if (!result.success) {
    return formatZodError(result.error)
  }

  if (hasSamePlanetLegInFlightPath(result.data.flightPath)) {
    return errors.SAME_PLANET_LEG
  }

  return result.data
}
