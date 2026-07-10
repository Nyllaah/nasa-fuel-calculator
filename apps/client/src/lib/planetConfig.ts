import type { Planet } from '@nasa-fuel/shared'

type PlanetConfig = {
  glow: string
  ring: string
  image: string
}

const PLANET_CONFIG: Record<Planet, PlanetConfig> = {
  earth: {
    glow: 'rgba(59,130,246,0.6)',
    ring: 'rgba(59,130,246,0.25)',
    image: '/Earth.svg',
  },
  moon: {
    glow: 'rgba(148,163,184,0.6)',
    ring: 'rgba(148,163,184,0.2)',
    image: '/Moon.svg',
  },
  mars: {
    glow: 'rgba(249,115,22,0.6)',
    ring: 'rgba(249,115,22,0.2)',
    image: '/Mars.svg',
  },
}

export { PLANET_CONFIG }
