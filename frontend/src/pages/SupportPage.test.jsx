import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupportPage from './SupportPage';

vi.mock('@/api/ai', () => ({
  aiAPI: {
    support: vi.fn(),
  },
}));

describe('SupportPage', () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockClear();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
  });

  it('does not scroll the whole page away from the support header on first render', async () => {
    render(
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Support Center')).toBeInTheDocument();
    await waitFor(() => expect(scrollIntoView).not.toHaveBeenCalled());
  });
});
