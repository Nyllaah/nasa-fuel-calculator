function formatKg(value: number, locale: string): string {
  return value.toLocaleString(locale)
}

function pointToRectDist(point: { x: number; y: number }, rect: DOMRect): number {
  const dx = Math.max(rect.left - point.x, 0, point.x - rect.right)
  const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom)
  return Math.hypot(dx, dy)
}

export { formatKg, pointToRectDist }
