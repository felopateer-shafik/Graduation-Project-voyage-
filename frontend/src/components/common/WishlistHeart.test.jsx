import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WishlistHeart from './WishlistHeart';
import useAuthStore from '@/store/useAuthStore';
import useWishlistStore from '@/store/useWishlistStore';

vi.mock('@/api/wishlist', () => ({
  wishlistAPI: {
    add: vi.fn(),
    list: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('WishlistHeart', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    useWishlistStore.setState({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('redirects unauthenticated users to login instead of adding wishlist items', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/hotels']}>
        <Routes>
          <Route
            path="/hotels"
            element={<WishlistHeart item={{ id: 5, name: 'Nile View' }} type="hotel" />}
          />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /add to wishlist/i }));

    expect(await screen.findByText('Login screen')).toBeInTheDocument();
    expect(useWishlistStore.getState().items).toEqual([]);
  });
});
