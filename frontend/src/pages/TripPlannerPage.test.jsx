import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripPlannerPage from './TripPlannerPage';

vi.mock('@/api/ai', () => ({
  aiAPI: {
    tripPlan: vi.fn(),
  },
}));

describe('TripPlannerPage', () => {
  it('renders a custom instructions field above the generate button', () => {
    render(
      <MemoryRouter>
        <TripPlannerPage />
      </MemoryRouter>
    );

    const instructions = screen.getByLabelText(/custom instructions/i);
    const generateButton = screen.getByRole('button', { name: /generate itinerary/i });

    expect(instructions).toBeInTheDocument();
    expect(instructions.compareDocumentPosition(generateButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
