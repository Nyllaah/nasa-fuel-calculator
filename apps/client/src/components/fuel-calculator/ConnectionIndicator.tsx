import type { ConnectionStatus } from '@/hooks/useWebSocket'
import { useLocale } from '@/context/LocaleContext'
import { cn } from '@/lib/utils'

type ConnectionIndicatorProps = {
  status: ConnectionStatus
}

const STATUS_COLOR: Record<ConnectionStatus, string> = {
  connected: 'text-green-500',
  connecting: 'text-amber-500',
  disconnected: 'text-red-500',
  error: 'text-red-500',
}

const STATUS_DOT: Record<ConnectionStatus, string> = {
  connected: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-[fc-pulse_2s_infinite]',
  connecting: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
  disconnected: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  error: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
}

function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  const { ui } = useLocale()

  return (
    <div className="fc-telemetry">
      <div className={cn('size-2 rounded-full', STATUS_DOT[status])} />
      <span className={cn('fc-status-text', STATUS_COLOR[status])}>{ui.STATUS[status]}</span>
    </div>
  )
}

export { ConnectionIndicator }
