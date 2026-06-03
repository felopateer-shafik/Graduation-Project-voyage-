import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import useBookingStore from '@/store/useBookingStore';
import { loyaltyAPI } from '@/api/loyalty';

vi.mock('@/api/loyalty', () => ({
  loyaltyAPI: {
    getBalance: vi.fn(),
  },
}));

vi.mock('@/api/bookings', () => ({
  bookingsAPI: {
    create: vi.fn(),
    checkout: vi.fn(),
    checkoutVisa: vi.fn(),
  },
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBookingStore.setState({
      bookingItem: {
        id: 42,
        price: 1200,
        airline: 'Voyage Air',
        flightNumber: 'VA123',
        from: { city: 'Cairo' },
        to: { city: 'Dubai' },
        class: 'Economy',
      },
      bookingType: 'flight',
      confirmationCode: null,
      bookingStatus: null,
      isProcessing: false,
      error: null,
    });
  });

  it('shows the listed price as the checkout total without taxes', () => {
    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/tax/i)).not.toBeInTheDocument();
    expect(screen.getByText('Flight')).toBeInTheDocument();
    expect(screen.getAllByText('1,200 EGP').length).toBeGreaterThan(0);
  });

  it('loads and displays wallet balance when wallet payment is selected', async () => {
    loyaltyAPI.getBalance.mockResolvedValueOnce({ walletBalance: 2000 });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /wallet/i }));

    await waitFor(() => expect(loyaltyAPI.getBalance).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Wallet balance')).toBeInTheDocument();
    expect(screen.getByText('After payment')).toBeInTheDocument();
    expect(screen.getByText('2,000 EGP')).toBeInTheDocument();
    expect(screen.getByText('800 EGP')).toBeInTheDocument();
  });
});
