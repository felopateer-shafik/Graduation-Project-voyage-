import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HotelDetailPage from './HotelDetailPage';
import { hotelsAPI } from '@/api/hotels';
import useBookingStore from '@/store/useBookingStore';

vi.mock('@/api/hotels', () => ({
  hotelsAPI: {
    getById: vi.fn(),
  },
}));

vi.mock('@/components/common/WishlistHeart', () => ({
  default: () => <button type="button">Wishlist</button>,
}));

vi.mock('@/components/reviews/ReviewList', () => ({
  default: () => null,
}));

const hotel = {
  id: 8,
  name: 'Nile View',
  city: 'Cairo',
  location: 'Downtown',
  description: 'A calm stay near the river.',
  pricePerNight: 300,
  rating: 4.8,
  reviewCount: 10,
  stars: 5,
  roomType: 'Deluxe',
  roomSize: '32 sqm',
  bedType: 'King',
  view: 'Nile',
  amenities: ['wifi'],
  images: [],
  availableRooms: 5,
  discount: 0,
  freeCancellation: true,
  loyaltyPoints: 0,
};

describe('HotelDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBookingStore.getState().clearBooking();
    hotelsAPI.getById.mockResolvedValue(hotel);
  });

  it('lets users select rooms, days, and guests before reserving', async () => {
    render(
      <MemoryRouter initialEntries={['/hotels/8']}>
        <Routes>
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/checkout" element={<div>Checkout</div>} />
        </Routes>
      </MemoryRouter>
    );

    const rooms = await screen.findByLabelText(/rooms/i);
    const days = screen.getByLabelText(/days/i);
    const guests = screen.getByLabelText(/guests/i);

    await userEvent.clear(rooms);
    await userEvent.type(rooms, '2');
    await userEvent.clear(days);
    await userEvent.type(days, '3');
    await userEvent.clear(guests);
    await userEvent.type(guests, '4');

    expect(screen.getByText('2 rooms x 3 days')).toBeInTheDocument();
    expect(screen.getAllByText('1,800 EGP').length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /reserve now/i }));

    expect(useBookingStore.getState().bookingDetails).toEqual({ rooms: 2, days: 3, guests: 4 });
  });
});
