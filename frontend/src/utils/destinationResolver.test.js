import { beforeEach, describe, expect, it, vi } from 'vitest';
import { countriesAPI } from '@/api/countries';
import { citiesAPI } from '@/api/cities';
import { resolveCitySearchTerm, resolveDestination } from './destinationResolver';

vi.mock('@/api/countries', () => ({
  countriesAPI: {
    list: vi.fn(),
  },
}));

vi.mock('@/api/cities', () => ({
  citiesAPI: {
    list: vi.fn(),
  },
}));

describe('resolveDestination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    countriesAPI.list.mockResolvedValue([
      { code: 'EG', name: 'Egypt' },
      { code: 'AE', name: 'United Arab Emirates' },
    ]);
    citiesAPI.list.mockResolvedValue([
      { code: 'CAI', name: 'Cairo', countryCode: 'EG' },
      { code: 'DXB', name: 'Dubai', countryCode: 'AE' },
    ]);
  });

  it.each([
    ['Egypt', '/deals/EG'],
    ['EG', '/deals/EG'],
    ['Cairo', '/cities/CAI'],
    ['CAI', '/cities/CAI'],
    ['Dubai', '/cities/DXB'],
    ['DXB', '/cities/DXB'],
  ])('resolves %s to %s', async (query, expectedPath) => {
    await expect(resolveDestination(query)).resolves.toMatchObject({ path: expectedPath });
  });

  it('falls back to Explore query for unknown searches', async () => {
    await expect(resolveDestination('Atlantis')).resolves.toMatchObject({
      path: '/explore?q=Atlantis',
      type: 'explore',
    });
  });

  it.each([
    ['Dubai', 'DXB'],
    ['DXB', 'DXB'],
    ['Unknown City', 'Unknown City'],
  ])('normalizes package city search term %s to %s', async (query, expectedTerm) => {
    await expect(resolveCitySearchTerm(query)).resolves.toBe(expectedTerm);
  });
});
