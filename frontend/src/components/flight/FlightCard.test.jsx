import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FlightCard from './FlightCard';

vi.mock('@/components/common/WishlistHeart', () => ({
  default: () => <button type="button">Wishlist</button>,
}));

const baseFlight = {
  id: 1,
  airlineLogo: 'VA',
  airline: 'Voyage Air',
  flightNumber: 'VA123',
  from: { code: 'CAI', city: 'Cairo' },
  to: { code: 'DXB', city: 'Dubai' },
  duration: '3h 30m',
  stopLabel: 'Non-stop',
  price: 1200,
  class: 'Economy',
  seatsLeft: 8,
};

describe('FlightCard', () => {
  it('shows whether a flight is refundable', () => {
    render(
      <MemoryRouter>
        <FlightCard flight={{ ...baseFlight, refundable: true }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Refundable')).toBeInTheDocument();
  });

  it('shows non-refundable when the flight is not refundable', () => {
    render(
      <MemoryRouter>
        <FlightCard flight={{ ...baseFlight, refundable: false }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Non-refundable')).toBeInTheDocument();
  });
});
