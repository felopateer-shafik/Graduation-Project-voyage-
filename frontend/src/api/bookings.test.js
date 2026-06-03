import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosInstance from './axiosInstance';
import { bookingsAPI } from './bookings';
import { API } from '@/constants/apiEndpoints';

vi.mock('./axiosInstance', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('bookingsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends hotel room, day, and guest counts when creating a hotel booking', async () => {
    await bookingsAPI.create({
      type: 'hotel',
      item: { id: 9 },
      rooms: 2,
      days: 3,
      guests: 4,
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(API.BOOKINGS.CREATE, {
      hotelId: 9,
      rooms: 2,
      days: 3,
      guests: 4,
    });
  });

  it('sends payment method and card details when freezing a flight price', async () => {
    const paymentDetails = {
      cardNumber: '4111111111111111',
      expiryDate: '12/30',
      cvv: '123',
      cardHolderName: 'Ali Traveler',
    };

    await bookingsAPI.freezePrice({
      type: 'flight',
      item: { id: 12 },
      paymentMethod: 'CARD',
      paymentDetails,
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(API.BOOKINGS.FREEZE, {
      flightId: 12,
      paymentMethod: 'CARD',
      paymentDetails,
    });
  });
});
