import { fuelErrorSchema, fuelMessageSchema, fuelResponseSchema } from '@nasa-fuel/shared'
import type { FuelError, FuelMessage, FuelResponse } from '@nasa-fuel/shared'
import { errors } from '@/constants/errors'

export type ParseFuelMessageFailure = { ok: false; error: string }

export type ParseFuelMessageResult = { ok: true; message: FuelMessage } | ParseFuelMessageFailure

function isParseFailure(result: ParseFuelMessageResult): result is ParseFuelMessageFailure {
  return result.ok === false
}

function isFuelError(value: unknown): value is FuelError {
  return fuelErrorSchema.safeParse(value).success
}

function isFuelResponse(value: unknown): value is FuelResponse {
  return fuelResponseSchema.safeParse(value).success
}

function parseFuelMessage(data: string): ParseFuelMessageResult {
  try {
    const parsed: unknown = JSON.parse(data)
    const result = fuelMessageSchema.safeParse(parsed)

    if (result.success) {
      return { ok: true, message: result.data }
    }

    return { ok: false, error: errors.INVALID_RESPONSE }
  } catch {
    return { ok: false, error: errors.INVALID_RESPONSE }
  }
}

export { parseFuelMessage, isFuelError, isFuelResponse, isParseFailure }
