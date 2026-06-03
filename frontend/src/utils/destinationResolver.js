import { countriesAPI } from '@/api/countries';
import { citiesAPI } from '@/api/cities';
import { ROUTES } from '@/constants/routes';

const normalize = (value) => (value || '').trim().toLowerCase();

function bestMatch(items, query, fields) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  const exact = items.find((item) =>
    fields.some((field) => normalize(item[field]) === normalizedQuery)
  );
  if (exact) return exact;

  return items.find((item) =>
    fields.some((field) => normalize(item[field]).includes(normalizedQuery))
  ) || null;
}

export async function resolveDestination(input) {
  const query = (input || '').trim();
  if (!query) {
    return { type: 'empty', path: ROUTES.HOME };
  }

  const [countries, cities] = await Promise.all([
    countriesAPI.list(false),
    citiesAPI.list(),
  ]);

  const country = bestMatch(Array.isArray(countries) ? countries : [], query, ['code', 'name']);
  if (country?.code) {
    return {
      type: 'country',
      code: country.code,
      label: country.name,
      path: `/deals/${country.code}`,
    };
  }

  const city = bestMatch(Array.isArray(cities) ? cities : [], query, ['code', 'name']);
  if (city?.code) {
    return {
      type: 'city',
      code: city.code,
      label: city.name,
      path: `/cities/${city.code}`,
    };
  }

  return {
    type: 'explore',
    query,
    path: `${ROUTES.EXPLORE}?q=${encodeURIComponent(query)}`,
  };
}

export async function resolveCitySearchTerm(input) {
  const query = (input || '').trim();
  if (!query) {
    return '';
  }

  const cities = await citiesAPI.list();
  const city = bestMatch(Array.isArray(cities) ? cities : [], query, ['code', 'name']);
  return city?.code || query;
}
