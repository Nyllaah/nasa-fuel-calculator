import type { Locale } from '@/constants/ui'

type ClientErrorCode =
  'INVALID_RESPONSE' | 'WEBSOCKET_CONNECTION' | 'SAME_PLANET_LEG' | 'INVALID_MASS'

type ClientErrors = Record<ClientErrorCode, string>

const CLIENT_ERRORS: Record<Locale, ClientErrors> = {
  'pt-BR': {
    INVALID_RESPONSE: 'Resposta inválida do servidor',
    WEBSOCKET_CONNECTION: 'Erro de conexão WebSocket',
    SAME_PLANET_LEG: 'Decolagem e pouso no mesmo planeta não são permitidos.',
    INVALID_MASS: 'Informe uma massa positiva em quilogramas.',
  },
  en: {
    INVALID_RESPONSE: 'Invalid server response',
    WEBSOCKET_CONNECTION: 'WebSocket connection error',
    SAME_PLANET_LEG: 'Launch and land on the same planet are not allowed.',
    INVALID_MASS: 'Enter a positive mass in kilograms.',
  },
}

export type { ClientErrorCode, ClientErrors }
export { CLIENT_ERRORS }
