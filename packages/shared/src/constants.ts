import { Planet } from './types.js'

const ACTIONS = ['launch', 'land'] as const

const PLANETS = ['earth', 'moon', 'mars'] as const

const GRAVITY: Record<Planet, number> = {
  earth: 9.807,
  moon: 1.62,
  mars: 3.711,
}

export { ACTIONS, PLANETS, GRAVITY }
