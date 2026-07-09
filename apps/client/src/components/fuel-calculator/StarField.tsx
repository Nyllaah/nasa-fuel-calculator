import type { CSSProperties } from 'react'

const stars = Array.from({ length: 80 }, (_, id) => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4,
  opacity: Math.random() * 0.7 + 0.15,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 5,
}))

function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="fc-starfield-bg absolute inset-0" />
      {stars.map((star) => {
        const style = {
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
          opacity: star.opacity,
          boxShadow:
            star.size > 1.4 ? `0 0 ${star.size * 2}px rgba(255,255,255,0.5)` : undefined,
          '--star-dur': `${star.dur}s`,
          '--star-delay': `${star.delay}s`,
        } as CSSProperties

        return <div key={star.id} className="fc-star" style={style} />
      })}
    </div>
  )
}

export { StarField }
