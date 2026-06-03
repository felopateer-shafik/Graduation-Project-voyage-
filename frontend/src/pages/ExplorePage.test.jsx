import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExplorePage from './ExplorePage';
import { citiesAPI } from '@/api/cities';

vi.mock('@/api/cities', () => ({
  citiesAPI: {
    getLandmarks: vi.fn(),
    list: vi.fn(),
  },
}));

describe('ExplorePage', () => {
  it('filters landmarks by city name from the query string', async () => {
    citiesAPI.getLandmarks.mockImplementation(({ hiddenGem }) => (
      Promise.resolve(hiddenGem ? [] : [
        {
          id: 1,
          name: 'Great Pyramid of Giza',
          description: 'Ancient wonder on the Giza plateau',
          category: 'historic',
          cityCode: 'CAI',
        },
      ])
    ));
    citiesAPI.list.mockResolvedValue([{ code: 'CAI', name: 'Cairo' }]);

    render(
      <MemoryRouter initialEntries={['/explore?q=Cairo']}>
        <Routes>
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Great Pyramid of Giza')).toBeInTheDocument();
    expect(screen.queryByText('No landmarks found')).not.toBeInTheDocument();
  });
});
