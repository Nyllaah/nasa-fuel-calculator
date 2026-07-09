function parseMass(mass: string): number | null {
  const massNum = Number(mass)

  if (!Number.isFinite(massNum) || massNum <= 0) {
    return null
  }

  return massNum
}

function isValidMass(mass: string): boolean {
  return parseMass(mass) !== null
}

export { parseMass, isValidMass }
