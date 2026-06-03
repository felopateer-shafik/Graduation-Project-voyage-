import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTripsStore = create(
  persist(
    (set) => ({
      trips: [],
      addTrip: (trip) => set((state) => ({ 
        trips: [...state.trips, { ...trip, id: Date.now().toString() }] 
      })),
      removeTrip: (id) => set((state) => ({
        trips: state.trips.filter(t => t.id !== id)
      })),
      clearTrips: () => set({ trips: [] })
    }),
    {
      name: 'voyage-trips-storage',
    }
  )
);

export default useTripsStore;
