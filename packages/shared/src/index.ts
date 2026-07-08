export const PLANETS = ['earth', 'moon', 'mars'] as const;
export type Planet = (typeof PLANETS)[number];

export const ACTIONS = ['launch', 'land'] as const;
export type Action = (typeof ACTIONS)[number];

export const GRAVITY: Record<Planet, number> = {
  earth: 9.807,
  moon: 1.62,
  mars: 3.711,
};

export interface FlightStep {
  action: Action;
  planet: Planet;
}

export interface FuelRequest {
  mass: number;
  flight_path: FlightStep[];
}

export interface FuelBreakdownStep extends FlightStep {
  fuel: number;
}

export interface FuelResponse {
  total_fuel: number;
  breakdown: FuelBreakdownStep[];
}

export interface FuelError {
  error: string;
}

export type FuelMessage = FuelResponse | FuelError;

export function isPlanet(value: string): value is Planet {
  return (PLANETS as readonly string[]).includes(value);
}

export function isAction(value: string): value is Action {
  return (ACTIONS as readonly string[]).includes(value);
}
