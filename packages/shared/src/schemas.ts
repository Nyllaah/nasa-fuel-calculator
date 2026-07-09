import { z } from 'zod'
import { ACTIONS, PLANETS } from './constants.js'

const flightStepSchema = z.object({
  action: z.enum(ACTIONS),
  planet: z.enum(PLANETS),
})

const fuelBreakdownStepSchema = flightStepSchema.extend({
  fuel: z.number(),
})

const fuelRequestSchema = z.object({
  mass: z.number().positive(),
  flightPath: z.array(flightStepSchema).min(1),
})

const fuelResponseSchema = z.object({
  totalFuel: z.number(),
  breakdown: z.array(fuelBreakdownStepSchema),
})

const fuelErrorSchema = z.object({
  error: z.string(),
})

const fuelMessageSchema = z.union([fuelResponseSchema, fuelErrorSchema])

export {
  flightStepSchema,
  fuelBreakdownStepSchema,
  fuelRequestSchema,
  fuelResponseSchema,
  fuelErrorSchema,
  fuelMessageSchema,
}
