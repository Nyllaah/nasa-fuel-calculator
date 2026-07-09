import { ACTIONS, PLANETS } from './constants.js'

type Action = (typeof ACTIONS)[number]

type Planet = (typeof PLANETS)[number]

type FuelMessage = FuelResponse | FuelError

interface FlightStep {
  action: Action
  planet: Planet
}

interface FuelBreakdownStep extends FlightStep {
  fuel: number
}

type FuelRequest = {
  mass: number
  flightPath: FlightStep[]
}

type FuelResponse = {
  totalFuel: number
  breakdown: FuelBreakdownStep[]
}

type FuelError = {
  error: string
}

export type { Action, Planet, FuelMessage, FuelRequest, FuelBreakdownStep, FuelResponse, FuelError }
