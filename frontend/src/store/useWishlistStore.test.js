import { beforeEach, describe, expect, it, vi } from 'vitest';
import useWishlistStore from './useWishlistStore';
import { wishlistAPI } from '@/api/wishlist';

vi.mock('@/api/wishlist', () => ({
  wishlistAPI: {
    add: vi.fn(),
    list: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('useWishlistStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useWishlistStore.setState({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('normalizes backend wishlist rows into frontend items', async () => {
    wishlistAPI.list.mockResolvedValueOnce([
      {
        id: 77,
        type: 'hotel',
        item: {
          id: 5,
          name: 'Nile View',
          city: 'Cairo',
          pricePerNight: 900,
          rating: 4.7,
          reviewCount: 12,
          images: 'one.jpg,two.jpg',
          amenities: 'wifi,pool',
          latitude: 30.04,
          longitude: 31.23,
        },
      },
      {
        id: 88,
        type: 'flight',
        item: {
          id: 12,
          airlineName: 'EgyptAir',
          flightNumber: 'MS 701',
          departureCity: 'Cairo',
          departureCityCode: 'CAI',
          arrivalCity: 'Dubai',
          arrivalCityCode: 'DXB',
          duration: '3h 30m',
          price: 4500,
          availableSeats: 4,
          stops: 0,
          cabinClass: 'Economy',
        },
      },
    ]);

    await useWishlistStore.getState().fetchWishlist();

    expect(useWishlistStore.getState().items).toEqual([
      expect.objectContaining({
        id: 5,
        name: 'Nile View',
        type: 'hotel',
        wishlistId: 77,
        images: ['one.jpg', 'two.jpg'],
        amenities: ['wifi', 'pool'],
        coordinates: { lat: 30.04, lng: 31.23 },
      }),
      expect.objectContaining({
        id: 12,
        type: 'flight',
        wishlistId: 88,
        airline: 'EgyptAir',
        from: { city: 'Cairo', code: 'CAI' },
        to: { city: 'Dubai', code: 'DXB' },
        class: 'Economy',
      }),
    ]);
  });

  it('clears wishlist through the backend and local state', async () => {
    wishlistAPI.clear.mockResolvedValueOnce(undefined);
    useWishlistStore.setState({
      items: [{ id: 5, type: 'hotel', wishlistId: 77, name: 'Nile View' }],
    });

    await useWishlistStore.getState().clearWishlist();

    expect(wishlistAPI.clear).toHaveBeenCalledTimes(1);
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it('adds a wishlist item once and stores the backend row id', async () => {
    wishlistAPI.add.mockResolvedValueOnce({ id: 91 });

    await useWishlistStore.getState().toggleItem({ id: 8, type: 'tour', name: 'Nile Walk' });

    expect(wishlistAPI.add).toHaveBeenCalledWith({ type: 'tour', itemId: 8 });
    expect(useWishlistStore.getState().items).toEqual([
      { id: 8, type: 'tour', name: 'Nile Walk', wishlistId: 91 },
    ]);
  });

  it('removes an existing wishlist item using the backend row id', async () => {
    wishlistAPI.remove.mockResolvedValueOnce(undefined);
    useWishlistStore.setState({
      items: [{ id: 8, type: 'tour', wishlistId: 91, name: 'Nile Walk' }],
    });

    await useWishlistStore.getState().toggleItem({ id: 8, type: 'tour', name: 'Nile Walk' });

    expect(wishlistAPI.remove).toHaveBeenCalledWith(91);
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it('reverts optimistic duplicate adds when the backend rejects the item', async () => {
    wishlistAPI.add.mockRejectedValueOnce(new Error('Already in wishlist'));

    await useWishlistStore.getState().toggleItem({ id: 9, type: 'hotel', name: 'Sea Hotel' });

    expect(useWishlistStore.getState().items).toEqual([]);
    expect(useWishlistStore.getState().error).toBe('Already in wishlist');
  });
});
