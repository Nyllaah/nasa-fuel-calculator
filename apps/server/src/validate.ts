import { z } from 'zod'
import { ACTIONS, PLANETS } from '@nasa-fuel/shared'
import type { FuelRequest } from '@nasa-fuel/shared'
import { errors } from './constants/errors.js'

const flightStepSchema = z.object({
  action: z.enum(ACTIONS),
  planet: z.enum(PLANETS),
})

export const fuelRequestSchema = z.object({
  mass: z.number().positive(errors.INVALID_MASS),
  flightPath: z.array(flightStepSchema).min(1, errors.EMPTY_FLIGHT_PATH),
})

function formatZodError(error: z.ZodError): string {
  const issue = error.issues[0]

  if (!issue) {
    return errors.INVALID_PAYLOAD
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'action') {
    return errors.INVALID_ACTION(String(issue.received))
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'planet') {
    return errors.INVALID_PLANET(String(issue.received))
  }

  return issue.message
}

export function validateRequest(data: unknown): FuelRequest | string {
  const result = fuelRequestSchema.safeParse(data)

  if (!result.success) {
    return formatZodError(result.error)
  }

  return result.data
}
