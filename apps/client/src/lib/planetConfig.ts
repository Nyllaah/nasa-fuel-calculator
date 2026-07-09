import type { Planet } from '@nasa-fuel/shared'
import { PLANETS } from '@nasa-fuel/shared'

type PlanetConfig = {
  label: string
  color: string
  glow: string
  ring: string
  image: string
}

const PLANET_CONFIG: Record<Planet, PlanetConfig> = {
  earth: {
    label: 'Terra',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.6)',
    ring: 'rgba(59,130,246,0.25)',
    image: '/Earth.svg',
  },
  moon: {
    label: 'Lua',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.6)',
    ring: 'rgba(148,163,184,0.2)',
    image: '/Moon.svg',
  },
  mars: {
    label: 'Marte',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.6)',
    ring: 'rgba(249,115,22,0.2)',
    image: '/Mars.svg',
  },
}

export { PLANET_CONFIG, PLANETS }
