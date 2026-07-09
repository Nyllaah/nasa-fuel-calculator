import { useCallback, useEffect, useRef, useState } from 'react'

const INITIAL_RECONNECT_DELAY_MS = 1000
const MAX_RECONNECT_DELAY_MS = 30_000

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

type UseWebSocketOptions = {
  url: string
  onMessage: (data: string) => void
}

export function useWebSocket({ url, onMessage }: UseWebSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY_MS)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onMessageRef = useRef(onMessage)

  onMessageRef.current = onMessage

  const send = useCallback((payload: unknown) => {
    const socket = socketRef.current

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload))
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    function scheduleReconnect(connect: () => void) {
      const delay = reconnectDelayRef.current

      reconnectTimerRef.current = setTimeout(() => {
        reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS)
        connect()
      }, delay)
    }

    function connect() {
      if (cancelled) return

      setStatus('connecting')
      setError(null)

      const ws = new WebSocket(url)
      socketRef.current = ws

      ws.onopen = () => {
        if (cancelled) return

        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS
        setStatus('connected')
      }

      ws.onmessage = (event) => {
        if (cancelled) return

        onMessageRef.current(event.data as string)
      }

      ws.onerror = () => {
        if (cancelled) return

        setStatus('error')
        setError('WebSocket connection error')
      }

      ws.onclose = () => {
        if (cancelled) return

        socketRef.current = null
        setStatus('disconnected')
        scheduleReconnect(connect)
      }
    }

    connect()

    return () => {
      cancelled = true

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }

      socketRef.current?.close()
      socketRef.current = null
    }
  }, [url])

  return { status, error, send }
}

export type { ConnectionStatus }
