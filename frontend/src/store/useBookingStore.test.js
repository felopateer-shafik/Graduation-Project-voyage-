import { beforeEach, describe, expect, it } from 'vitest';
import useBookingStore from './useBookingStore';

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.getState().clearBooking();
  });

  it('stores hotel booking details with the selected item', () => {
    useBookingStore.getState().setBookingItem(
      { id: 4, name: 'Nile Hotel' },
      'hotel',
      { rooms: 2, days: 3, guests: 4 }
    );

    expect(useBookingStore.getState().bookingItem).toEqual({ id: 4, name: 'Nile Hotel' });
    expect(useBookingStore.getState().bookingType).toBe('hotel');
    expect(useBookingStore.getState().bookingDetails).toEqual({ rooms: 2, days: 3, guests: 4 });
  });
});
