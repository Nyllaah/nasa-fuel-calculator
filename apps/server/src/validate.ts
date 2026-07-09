import { z } from 'zod'
import { ACTIONS, PLANETS } from '@nasa-fuel/shared'
import type { FuelRequest } from '@nasa-fuel/shared'

const flightStepSchema = z.object({
  action: z.enum(ACTIONS),
  planet: z.enum(PLANETS),
})

export const fuelRequestSchema = z.object({
  mass: z.number().positive('Mass must be a positive number'),
  flightPath: z.array(flightStepSchema).min(1, 'Flight path must be a non-empty array'),
})

function formatZodError(error: z.ZodError): string {
  const issue = error.issues[0]

  if (!issue) {
    return 'Invalid request payload'
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'action') {
    return `Invalid action: ${String(issue.received)}`
  }

  if (issue.code === 'invalid_enum_value' && issue.path.at(-1) === 'planet') {
    return `Invalid planet: ${String(issue.received)}`
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
