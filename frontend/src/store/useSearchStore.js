import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSearchStore = create(
  persist(
    (set) => ({
      // Search state
      searchType: 'flights', // 'flights' | 'hotels'
      searchParams: {
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        travelers: 1,
        tripType: 'roundTrip', // 'oneWay' | 'roundTrip'
        cabinClass: 'economy',
      },

      // Results
      results: [],
      isSearching: false,
      searchError: null,
      totalResults: 0,

      // Filters
      filters: {
        priceRange: [0, 100000],
        stops: [],
        airlines: [],
        stars: [],
        amenities: [],
        sortBy: 'recommended',
      },

      // Actions
      setSearchType: (type) => set({ searchType: type }),

      setSearchParams: (params) => set((state) => ({
        searchParams: { ...state.searchParams, ...params },
      })),

      setResults: (results) => set({
        results,
        totalResults: results.length,
        isSearching: false,
        searchError: null,
      }),

      setSearching: (isSearching) => set({ isSearching }),

      setSearchError: (error) => set({ searchError: error, isSearching: false }),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

      clearSearch: () => set({
        results: [],
        isSearching: false,
        searchError: null,
        totalResults: 0,
      }),

      resetFilters: () => set({
        filters: {
          priceRange: [0, 100000],
          stops: [],
          airlines: [],
          stars: [],
          amenities: [],
          sortBy: 'recommended',
        },
      }),
    }),
    {
      name: 'voyage-search-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        searchType: state.searchType,
        searchParams: state.searchParams,
        results: state.results,
        totalResults: state.totalResults,
        filters: state.filters,
      }),
    }
  )
);

export default useSearchStore;
