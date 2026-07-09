import { useCallback, useState } from 'react'
import type { FuelMessage } from '@nasa-fuel/shared'
import { parseFuelMessage, isParseFailure } from '@/lib/parseFuelMessage'

export function useFuelMessage() {
  const [result, setResult] = useState<FuelMessage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMessage = useCallback((data: string) => {
    const parsed = parseFuelMessage(data)

    if (isParseFailure(parsed)) {
      setError(parsed.error)
      return
    }

    setResult(parsed.message)
    setError(null)
  }, [])

  return { result, error, handleMessage }
}
