import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistAPI } from '@/api/wishlist';
import { transformFlight } from '@/api/flights';
import { transformHotel } from '@/api/hotels';

const getItemKey = (item) => `${item?.type}:${item?.id}`;

const normalizeWishlistItem = (row) => {
  const type = row?.type;
  if (!row?.item?.id || !type) return null;

  const item =
    type === 'hotel'
      ? transformHotel(row.item)
      : type === 'flight'
        ? transformFlight(row.item)
        : row.item;

  return {
    ...item,
    type,
    wishlistId: row.id,
  };
};

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      // Keep optimistic UI but call backend
      toggleItem: async (item) => {
        if (!item?.id || !item?.type) return;
        const currentItems = get().items;
        const exists = currentItems.find((i) => getItemKey(i) === getItemKey(item));
        
        if (exists) {
          // Optimistic remove
          set({
            items: currentItems.filter((i) => getItemKey(i) !== getItemKey(item)),
            error: null,
          });
          try {
            if (exists.wishlistId) {
              await wishlistAPI.remove(exists.wishlistId);
            } else {
              // We need to fetch the wishlist first to get the ID if it wasn't fetched
              const list = await wishlistAPI.list();
              const found = list.find(w => w.type === item.type && w.item.id === item.id);
              if (found) await wishlistAPI.remove(found.id);
            }
          } catch (e) {
            console.error("Failed to remove from wishlist", e);
            // Revert on error
            set({ items: currentItems, error: e?.message || 'Failed to remove item' });
          }
        } else {
          // Optimistic add
          set({ items: [...currentItems, item], error: null });
          try {
            const added = await wishlistAPI.add({ type: item.type, itemId: item.id });
            // Update the optimistic item with the wishlistId from backend
            set({ 
              items: get().items.map(i => 
                getItemKey(i) === getItemKey(item) ? { ...i, wishlistId: added.id } : i
              ) 
            });
          } catch (e) {
            console.error("Failed to add to wishlist", e);
            // Revert on error
            set({ items: currentItems, error: e?.response?.data?.message || e?.message || 'Failed to add item' });
          }
        }
      },
      isInWishlist: (id, type) => {
        return get().items.some((i) => i.id === id && i.type === type);
      },
      clearLocalWishlist: () => set({ items: [], error: null, isLoading: false }),
      clearWishlist: async () => {
        const previousItems = get().items;
        set({ items: [], isLoading: true, error: null });
        try {
          await wishlistAPI.clear();
          set({ isLoading: false });
        } catch (e) {
          console.error("Failed to clear wishlist", e);
          set({
            items: previousItems,
            isLoading: false,
            error: e?.response?.data?.message || e?.message || 'Failed to clear wishlist',
          });
          throw e;
        }
      },
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await wishlistAPI.list();
          // Transform backend format to frontend format
          const formattedItems = data
            .map(normalizeWishlistItem)
            .filter(Boolean);
          set({ items: formattedItems, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
          set({
            isLoading: false,
            error: error?.response?.data?.message || error?.message || 'Failed to load wishlist',
          });
        }
      },
    }),
    {
      name: 'voyage-wishlist-storage',
    }
  )
);

export default useWishlistStore;
