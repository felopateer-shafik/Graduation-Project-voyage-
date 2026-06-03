import { create } from 'zustand';

const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isScrolled: false,
  activeNavItem: null,

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setScrolled: (isScrolled) => set({ isScrolled }),
  setActiveNavItem: (item) => set({ activeNavItem: item }),
}));

export default useUIStore;
