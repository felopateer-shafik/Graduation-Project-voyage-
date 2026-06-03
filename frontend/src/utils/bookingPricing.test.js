import { describe, expect, it } from 'vitest';
import { calculateBookingEstimate } from './bookingPricing';

describe('calculateBookingEstimate', () => {
  it('uses the listed flight price as the paid total without taxes', () => {
    expect(calculateBookingEstimate({ type: 'flight', item: { price: 1200 } })).toMatchObject({
      unitPrice: 1200,
      total: 1200,
      quantityLabel: 'Flight',
    });
  });

  it('uses package totalPrice as the paid bundle total', () => {
    expect(calculateBookingEstimate({
      type: 'package',
      item: { pricePerPerson: 1450, totalPrice: 2900 },
    })).toMatchObject({
      unitPrice: 2900,
      total: 2900,
      quantityLabel: 'Bundle',
    });
  });

  it('multiplies hotel room price by rooms and days only', () => {
    expect(calculateBookingEstimate({
      type: 'hotel',
      item: { pricePerNight: 900 },
      details: { rooms: 2, days: 3, guests: 5 },
    })).toMatchObject({
      unitPrice: 900,
      total: 5400,
      quantityLabel: '2 rooms x 3 days',
    });
  });
});
