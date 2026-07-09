import { useCallback, useEffect, useState } from 'react'
import type { ClientErrorCode } from '@/constants/errors'
import type { FlightStep, FuelRequest } from '@nasa-fuel/shared'
import { WS_URL } from '@/config'
import { useFuelMessage } from '@/hooks/useFuelMessage'
import { useWebSocket } from '@/hooks/useWebSocket'
import { parseMass } from '@/lib/mass'

function buildRequest(mass: string, flightPath: FlightStep[]): FuelRequest | null {
  const massNum = parseMass(mass)

  if (massNum === null || flightPath.length === 0) {
    return null
  }

  return { mass: massNum, flightPath }
}

export function useFuelCalculator() {
  const [mass, setMass] = useState('28801')
  const [flightPath, setFlightPath] = useState<FlightStep[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const { result, errorCode: messageErrorCode, handleMessage } = useFuelMessage()

  const onMessage = useCallback(
    (data: string) => {
      handleMessage(data)
      setIsCalculating(false)
    },
    [handleMessage],
  )

  const {
    status,
    errorCode: connectionErrorCode,
    send,
  } = useWebSocket({
    url: WS_URL,
    onMessage,
  })

  const errorCode: ClientErrorCode | null = connectionErrorCode ?? messageErrorCode

  useEffect(() => {
    if (status !== 'connected') {
      setIsCalculating(false)
      return
    }

    const request = buildRequest(mass, flightPath)

    if (request) {
      setIsCalculating(true)
      send(request)
      return
    }

    setIsCalculating(false)
  }, [status, mass, flightPath, send])

  return {
    mass,
    result,
    status,
    errorCode,
    isCalculating,
    setMass,
    setFlightPath,
  }
}
