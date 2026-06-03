import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FlightDetailPage from './FlightDetailPage';
import { flightsAPI } from '@/api/flights';
import { bookingsAPI } from '@/api/bookings';
import { loyaltyAPI } from '@/api/loyalty';

vi.mock('@/api/flights', () => ({
  flightsAPI: {
    getById: vi.fn(),
  },
}));

vi.mock('@/api/bookings', () => ({
  bookingsAPI: {
    freezePrice: vi.fn(),
  },
}));

vi.mock('@/api/loyalty', () => ({
  loyaltyAPI: {
    getBalance: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const flight = {
  id: 7,
  airline: 'Voyage Air',
  flightNumber: 'VA123',
  from: { code: 'CAI', city: 'Cairo', airport: 'Cairo International' },
  to: { code: 'DXB', city: 'Dubai', airport: 'Dubai International' },
  duration: '3h 30m',
  stopLabel: 'Non-stop',
  price: 1200,
  class: 'Economy',
  aircraft: 'A320',
  baggage: '23kg',
  refundable: true,
};

describe('FlightDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    flightsAPI.getById.mockResolvedValue(flight);
    bookingsAPI.freezePrice.mockResolvedValue({ freezeFee: 60 });
    loyaltyAPI.getBalance.mockResolvedValue({ walletBalance: 5000 });
  });

  it('supports card payment for price freeze', async () => {
    render(
      <MemoryRouter initialEntries={['/flights/7']}>
        <Routes>
          <Route path="/flights/:id" element={<FlightDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Refundable')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /card/i }));
    await userEvent.type(screen.getByLabelText(/card number/i), '4111111111111111');
    await userEvent.type(screen.getByLabelText(/cardholder name/i), 'Ali Traveler');
    await userEvent.type(screen.getByLabelText(/expiry date/i), '12/30');
    await userEvent.type(screen.getByLabelText(/cvv/i), '123');
    await userEvent.click(screen.getByRole('button', { name: /freeze price/i }));

    await waitFor(() => expect(bookingsAPI.freezePrice).toHaveBeenCalledWith({
      type: 'flight',
      item: flight,
      paymentMethod: 'CARD',
      paymentDetails: {
        cardNumber: '4111111111111111',
        cardHolderName: 'Ali Traveler',
        expiryDate: '12/30',
        cvv: '123',
      },
    }));
  });
});
