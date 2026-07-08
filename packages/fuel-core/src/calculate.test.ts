import { describe, expect, it } from 'vitest';
import type { FlightStep } from '@nasa-fuel/shared';
import { calculateFuel, recursiveFuel } from './calculate.js';

describe('recursiveFuel', () => {
  it('calculates Earth landing fuel for 28801 kg', () => {
    expect(recursiveFuel(28801, 'land', 'earth')).toBe(13447);
  });

  it('stops recursion when additional fuel is zero or negative', () => {
    expect(recursiveFuel(40, 'land', 'earth')).toBe(0);
  });
});

describe('calculateFuel acceptance scenarios', () => {
  const apollo11: FlightStep[] = [
    { action: 'launch', planet: 'earth' },
    { action: 'land', planet: 'moon' },
    { action: 'launch', planet: 'moon' },
    { action: 'land', planet: 'earth' },
  ];

  const marsMission: FlightStep[] = [
    { action: 'launch', planet: 'earth' },
    { action: 'land', planet: 'mars' },
    { action: 'launch', planet: 'mars' },
    { action: 'land', planet: 'earth' },
  ];

  const passengerShip: FlightStep[] = [
    { action: 'launch', planet: 'earth' },
    { action: 'land', planet: 'moon' },
    { action: 'launch', planet: 'moon' },
    { action: 'land', planet: 'mars' },
    { action: 'launch', planet: 'mars' },
    { action: 'land', planet: 'earth' },
  ];

  it('calculates Apollo 11 mission fuel', () => {
    const result = calculateFuel(28801, apollo11);
    expect(result.total_fuel).toBe(51898);
    expect(result.breakdown).toHaveLength(4);
  });

  it('calculates Mars Mission fuel', () => {
    const result = calculateFuel(14606, marsMission);
    expect(result.total_fuel).toBe(33388);
    expect(result.breakdown).toHaveLength(4);
  });

  it('calculates Passenger Ship fuel', () => {
    const result = calculateFuel(75432, passengerShip);
    expect(result.total_fuel).toBe(212161);
    expect(result.breakdown).toHaveLength(6);
  });
});
