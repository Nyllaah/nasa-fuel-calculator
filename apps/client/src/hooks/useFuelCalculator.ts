import { useEffect, useState } from 'react'
import type { FlightStep, FuelRequest } from '@nasa-fuel/shared'
import { WS_URL } from '@/config'
import { useFuelMessage } from '@/hooks/useFuelMessage'
import { useWebSocket } from '@/hooks/useWebSocket'

function buildRequest(mass: string, flightPath: FlightStep[]): FuelRequest | null {
  const massNum = Number(mass)

  if (!Number.isFinite(massNum) || massNum <= 0 || flightPath.length === 0) {
    return null
  }

  return { mass: massNum, flightPath }
}

export function useFuelCalculator() {
  const [mass, setMass] = useState('28801')
  const [flightPath, setFlightPath] = useState<FlightStep[]>([])

  const { result, error: messageError, handleMessage } = useFuelMessage()

  const {
    status,
    error: connectionError,
    send,
  } = useWebSocket({
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

  return {
    mass,
    result,
    status,
    error,
    setMass,
    setFlightPath,
  }
}
