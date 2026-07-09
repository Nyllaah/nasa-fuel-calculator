import { useCallback, useEffect, useState } from 'react'
import type { Action, FlightStep, FuelRequest, Planet } from '@nasa-fuel/shared'
import { ACTIONS, PLANETS } from '@nasa-fuel/shared'
import { WS_URL } from '@/config'
import { useFuelMessage } from '@/hooks/useFuelMessage'
import { useWebSocket } from '@/hooks/useWebSocket'

const APOLLO_11_PATH: FlightStep[] = [
  { action: 'launch', planet: 'earth' },
  { action: 'land', planet: 'moon' },
  { action: 'launch', planet: 'moon' },
  { action: 'land', planet: 'earth' },
]

function buildRequest(mass: string, flightPath: FlightStep[]): FuelRequest | null {
  const massNum = Number(mass)

  if (!Number.isFinite(massNum) || massNum <= 0 || flightPath.length === 0) {
    return null
  }

  return { mass: massNum, flightPath }
}

export function useFuelCalculator() {
  const [mass, setMass] = useState('28801')
  const [flightPath, setFlightPath] = useState<FlightStep[]>(APOLLO_11_PATH)

  const { result, error: messageError, handleMessage } = useFuelMessage()

  const { status, error: connectionError, send } = useWebSocket({
    url: WS_URL,
    onMessage: handleMessage,
  })

  const error = connectionError ?? messageError

  useEffect(() => {
    if (status !== 'connected') return

    const request = buildRequest(mass, flightPath)

    if (request) {
      send(request)
    }
  }, [status, mass, flightPath, send])

  const addStep = useCallback(() => {
    setFlightPath((prev) => [...prev, { action: 'launch', planet: 'earth' }])
  }, [])

  const removeStep = useCallback((index: number) => {
    setFlightPath((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateStep = useCallback(
    (index: number, field: 'action' | 'planet', value: string) => {
      setFlightPath((prev) =>
        prev.map((step, i) =>
          i === index
            ? {
                ...step,
                [field]: field === 'action' ? (value as Action) : (value as Planet),
              }
            : step,
        ),
      )
    },
    [],
  )

  return {
    mass,
    flightPath,
    result,
    status,
    error,
    setMass,
    addStep,
    removeStep,
    updateStep,
    planets: PLANETS,
    actions: ACTIONS,
  }
}
