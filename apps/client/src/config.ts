import type { FuelRequest } from '@nasa-fuel/shared'

export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001'

export type { FuelRequest }
