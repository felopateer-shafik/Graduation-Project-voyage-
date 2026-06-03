import { describe, expect, it } from 'vitest';
import { transformFlight } from './flights';

describe('transformFlight', () => {
  it('maps backend refundable flag onto the frontend flight shape', () => {
    const flight = transformFlight({
      id: 1,
      airlineName: 'Voyage Air',
      flightNumber: 'VA123',
      departureCity: 'Cairo',
      departureCityCode: 'CAI',
      arrivalCity: 'Dubai',
      arrivalCityCode: 'DXB',
      departureTime: '2026-10-15T10:00:00',
      arrivalTime: '2026-10-15T13:30:00',
      duration: '3h 30m',
      price: 1200,
      availableSeats: 5,
      refundable: true,
    });

    expect(flight.refundable).toBe(true);
  });
});
