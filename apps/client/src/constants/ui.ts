import type { Action, Planet } from '@nasa-fuel/shared'
import type { ConnectionStatus } from '@/hooks/useWebSocket'

type UiStrings = {
  APP_TITLE: string
  CELESTIAL_BODIES: string
  FLIGHT_PATH_CONFIG: string
  ADD_STOP: string
  LAUNCH_FROM: string
  LAND_ON: string
  RELEASE_TO_SELECT: string
  DROP_PLANET_HERE: string
  INVALID_DROP_SAME_PLANET: string
  CLEAR_PLANET: string
  REMOVE_STOP: string
  REMOVE_STOP_SHORT: string
  SPACECRAFT_MASS: string
  MASS_HINT: string
  KG: string
  CALCULATING: string
  WAITING_CONNECTION: string
  MISSION_ANALYSIS: string
  SELECT_ROUTE_PROMPT: string
  TOTAL_PROPELLANT: string
  TONS: string
  STEP_BREAKDOWN: string
  FOOTER_PREFIX: string
  FOOTER_ADD_STOP: string
  FOOTER_SUFFIX: string
  LANGUAGE: string
  ACTIONS: Record<Action, string>
  STATUS: Record<ConnectionStatus, string>
  PLANETS: Record<Planet, string>
  stopLabel: (index: number, total: number) => string
  actionLabel: (action: Action) => string
}

type Locale = 'pt-BR' | 'en'

const UI_PT: UiStrings = {
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
  CALCULATING: 'Calculando…',
  WAITING_CONNECTION: 'Aguardando conexão com o servidor…',
  MISSION_ANALYSIS: 'Análise da missão',
  SELECT_ROUTE_PROMPT: 'Selecione origem e destino para calcular o combustível necessário.',
  TOTAL_PROPELLANT: 'Propelente total necessário',
  TONS: 'TONELADAS',
  STEP_BREAKDOWN: 'Detalhamento por etapa',
  FOOTER_PREFIX: 'Arraste planetas para as paradas ·',
  FOOTER_ADD_STOP: '+ Adicionar parada',
  FOOTER_SUFFIX: 'para viagens de ida e volta e rotas multiplaneta',
  LANGUAGE: 'Idioma',
  ACTIONS: {
    launch: 'decolagem',
    land: 'pouso',
  },
  STATUS: {
    connecting: 'conectando',
    connected: 'conectado',
    disconnected: 'desconectado',
    error: 'erro',
  },
  PLANETS: {
    earth: 'Terra',
    moon: 'Lua',
    mars: 'Marte',
  },
  stopLabel(index, total) {
    if (index === 0) return this.LAUNCH_FROM
    if (index === total - 1) return this.LAND_ON
    return `PARADA ${index}`
  },
  actionLabel(action) {
    return this.ACTIONS[action]
  },
}

const UI_EN: UiStrings = {
  APP_TITLE: 'NASA Fuel Calculator',
  CELESTIAL_BODIES: 'Celestial bodies',
  FLIGHT_PATH_CONFIG: 'Flight path',
  ADD_STOP: 'Add stop',
  LAUNCH_FROM: 'LAUNCH FROM',
  LAND_ON: 'LAND ON',
  RELEASE_TO_SELECT: 'Release to select',
  DROP_PLANET_HERE: 'Drop a planet here',
  INVALID_DROP_SAME_PLANET: 'Choose a different planet',
  CLEAR_PLANET: 'Clear planet',
  REMOVE_STOP: 'Remove stop',
  REMOVE_STOP_SHORT: 'Stop',
  SPACECRAFT_MASS: 'Spacecraft dry mass',
  MASS_HINT: 'Payload + structure, no propellant',
  KG: 'KG',
  CALCULATING: 'Calculating…',
  WAITING_CONNECTION: 'Waiting for server connection…',
  MISSION_ANALYSIS: 'Mission analysis',
  SELECT_ROUTE_PROMPT: 'Select origin and destination to calculate required fuel.',
  TOTAL_PROPELLANT: 'Total propellant required',
  TONS: 'TONS',
  STEP_BREAKDOWN: 'Step breakdown',
  FOOTER_PREFIX: 'Drag planets to stops ·',
  FOOTER_ADD_STOP: '+ Add stop',
  FOOTER_SUFFIX: 'for round trips and multi-planet routes',
  LANGUAGE: 'Language',
  ACTIONS: {
    launch: 'launch',
    land: 'land',
  },
  STATUS: {
    connecting: 'connecting',
    connected: 'connected',
    disconnected: 'disconnected',
    error: 'error',
  },
  PLANETS: {
    earth: 'Earth',
    moon: 'Moon',
    mars: 'Mars',
  },
  stopLabel(index, total) {
    if (index === 0) return this.LAUNCH_FROM
    if (index === total - 1) return this.LAND_ON
    return `STOP ${index}`
  },
  actionLabel(action) {
    return this.ACTIONS[action]
  },
}

const LOCALES: Record<Locale, { label: string; ui: UiStrings }> = {
  'pt-BR': { label: 'Português', ui: UI_PT },
  en: { label: 'English', ui: UI_EN },
}

const DEFAULT_LOCALE: Locale = 'pt-BR'

export type { Locale, UiStrings }
export { LOCALES, DEFAULT_LOCALE }
