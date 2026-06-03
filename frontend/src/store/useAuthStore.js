import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '@/api/axiosInstance';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setAuth: (user, token) => {
        setAuthToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      logout: () => {
        setAuthToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      /**
       * Hydrate the auth token on app startup.
       * Called once in App.jsx to restore the axios header from persisted state.
       */
      hydrate: () => {
        const { token } = get();
        if (token) {
          setAuthToken(token);
        }
      },
    }),
    {
      name: 'voyage-auth-storage',
      // Only persist token and user, not loading/error states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
