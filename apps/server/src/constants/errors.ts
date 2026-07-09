export const errors = {
  INVALID_JSON: 'Invalid JSON',
  INVALID_PAYLOAD: 'Invalid request payload',
  INVALID_MASS: 'Mass must be a positive number',
  EMPTY_FLIGHT_PATH: 'Flight path must be a non-empty array',
  SAME_PLANET_LEG: 'Launch and land cannot be on the same planet',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_ACTION: (action: string) => `Invalid action: ${action}`,
  INVALID_PLANET: (planet: string) => `Invalid planet: ${planet}`,
} as const
