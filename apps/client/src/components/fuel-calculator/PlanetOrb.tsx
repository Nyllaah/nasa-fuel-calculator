import type { CSSProperties } from 'react'
import type { Planet } from '@nasa-fuel/shared'
import { PLANET_CONFIG } from '@/lib/planetConfig'
import { cn } from '@/lib/utils'

type PlanetOrbProps = {
  planet: Planet
  size?: number
  glow?: boolean
  dim?: boolean
}

function PlanetOrb({ planet, size = 64, glow = false, dim = false }: PlanetOrbProps) {
  const config = PLANET_CONFIG[planet]

  const style: CSSProperties = {
    width: size,
    height: size,
    boxShadow: glow
      ? `0 0 ${size * 0.4}px ${config.glow}, 0 0 ${size * 0.8}px ${config.ring}`
      : `0 0 ${size * 0.15}px ${config.ring}`,
  }

  return (
    <div className={cn('fc-orb', dim && 'opacity-30')} style={style}>
      <img src={config.image} alt={config.label} draggable={false} className="fc-orb-image" />
    </div>
  )
}

export { PlanetOrb }
