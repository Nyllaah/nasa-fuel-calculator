import { useCallback, useState } from 'react'
import type { ClientErrorCode } from '@/constants/errors'
import type { FuelMessage } from '@nasa-fuel/shared'
import { parseFuelMessage, isParseFailure } from '@/lib/parseFuelMessage'

export function useFuelMessage() {
  const [result, setResult] = useState<FuelMessage | null>(null)
  const [errorCode, setErrorCode] = useState<ClientErrorCode | null>(null)

  const handleMessage = useCallback((data: string) => {
    const parsed = parseFuelMessage(data)

    if (isParseFailure(parsed)) {
      setErrorCode(parsed.errorCode)
      return
    }

    setResult(parsed.message)
    setErrorCode(null)
  }, [])

  return { result, errorCode, handleMessage }
}
