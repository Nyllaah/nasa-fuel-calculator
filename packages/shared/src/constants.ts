import { Planet } from './types.js'

export const ACTIONS = ['launch', 'land'] as const

export const PLANETS = ['earth', 'moon', 'mars'] as const

export const GRAVITY: Record<Planet, number> = {
  earth: 9.807,
  moon: 1.62,
  mars: 3.711,
}
