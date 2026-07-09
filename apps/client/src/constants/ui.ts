import type { Action } from '@nasa-fuel/shared'
import type { ConnectionStatus } from '@/hooks/useWebSocket'

const ui = {
  APP_TITLE: 'Calculadora de Combustível NASA',
  CELESTIAL_BODIES: 'Corpos celestes',
  FLIGHT_PATH_CONFIG: 'Configuração da rota',
  ADD_STOP: 'Adicionar parada',
  LAUNCH_FROM: 'DECOLAR DE',
  LAND_ON: 'POUSAR EM',
  RELEASE_TO_SELECT: 'Solte para selecionar',
  DROP_PLANET_HERE: 'Arraste um planeta aqui',
  INVALID_DROP_SAME_PLANET: 'Escolha um planeta diferente',
  CLEAR_PLANET: 'Limpar planeta',
  REMOVE_STOP: 'Remover parada',
  REMOVE_STOP_SHORT: 'Parada',
  SPACECRAFT_MASS: 'Massa seca da nave',
  MASS_HINT: 'Carga útil + estrutura, sem propelente',
  KG: 'KG',
  MISSION_ANALYSIS: 'Análise da missão',
  SELECT_ROUTE_PROMPT: 'Selecione origem e destino para calcular o combustível necessário.',
  TOTAL_PROPELLANT: 'Propelente total necessário',
  TONS: 'TONELADAS',
  STEP_BREAKDOWN: 'Detalhamento por etapa',
  FOOTER_PREFIX: 'Arraste planetas para as paradas ·',
  FOOTER_ADD_STOP: '+ Adicionar parada',
  FOOTER_SUFFIX: 'para viagens de ida e volta e rotas multiplaneta',
  ACTIONS: {
    launch: 'decolagem',
    land: 'pouso',
  } satisfies Record<Action, string>,
  STATUS: {
    connecting: 'conectando',
    connected: 'conectado',
    disconnected: 'desconectado',
    error: 'erro',
  } satisfies Record<ConnectionStatus, string>,
} as const

function stopLabel(index: number, total: number): string {
  if (index === 0) return ui.LAUNCH_FROM
  if (index === total - 1) return ui.LAND_ON
  return `PARADA ${index}`
}

function actionLabel(action: Action): string {
  return ui.ACTIONS[action]
}

export { ui, stopLabel, actionLabel }
