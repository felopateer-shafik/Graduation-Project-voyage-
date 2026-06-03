import { useState, useEffect, useCallback } from 'react';
import PageShell from '@/components/common/PageShell';
import HotelCard from '@/components/hotel/HotelCard';
import { HotelCardSkeleton } from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import GlassCard from '@/components/common/GlassCard';
import { hotelsAPI } from '@/api/hotels';
import useSearchStore from '@/store/useSearchStore';
import { cn } from '@/utils/cn';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Lowest Price' },
  { id: 'price_high', label: 'Highest Price' },
  { id: 'rating', label: 'Highest Rated' },
];

const STAR_FILTERS = [5, 4, 3];

export default function HotelsPage() {
  const { searchParams, setSearchParams } = useSearchStore();

  const [view, setView] = useState('search');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [starFilter, setStarFilter] = useState([]);

  const [form, setForm] = useState({
    city: searchParams.to || '',
    checkIn: searchParams.departDate || '',
    checkOut: searchParams.returnDate || '',
    guests: searchParams.travelers || 1,
  });

  const fetchHotels = useCallback(async (params) => {
    setLoading(true);
    try {
      const results =
        params.city && params.city.trim()
          ? await hotelsAPI.search({ city: params.city })
          : await hotelsAPI.getAll();
      setHotels(results);
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // If user arrived from landing-page search with a destination, skip to results
  useEffect(() => {
    const city = searchParams.to?.trim();
    if (city) {
      setView('results');
      fetchHotels({ city });
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({
      to: form.city,
      departDate: form.checkIn,
      returnDate: form.checkOut,
      travelers: form.guests,
    });
    setView('results');
    await fetchHotels(form);
  };

  const handleModify = () => setView('search');

  // Sort
  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === 'price_low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price_high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Filter
  const filteredHotels =
    starFilter.length > 0
      ? sortedHotels.filter((h) => starFilter.includes(h.stars))
      : sortedHotels;

  const toggleStarFilter = (star) =>
    setStarFilter((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );

  // ─── Search view ───────────────────────────────────────────────────────────
  if (view === 'search') {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          {/* Hero heading */}
          <div className="text-center mb-10">
            <p className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Stay somewhere great</p>
            <h1 className="font-headline text-5xl sm:text-6xl font-extrabold tracking-tighter text-on-surface">
              Search Hotels
            </h1>
            <p className="text-on-surface-variant mt-3 text-base max-w-md mx-auto">
              Discover hotels for every budget and style. Enter a city or hotel name to begin.
            </p>
          </div>

          {/* Search form */}
          <div className="glass-panel ghost-border rounded-[2rem] p-6 md:p-8 shadow-glass-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* City / hotel name */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  location_on
                </span>
                <input
                  type="text"
                  placeholder="City or hotel name"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field pl-11"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Check-in */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
                {/* Check-out */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                    event_available
                  </span>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative max-w-xs">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  group
                </span>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className="input-field pl-11 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full group">
                <span className="material-symbols-outlined text-xl">search</span>
                Search Hotels
              </button>
            </form>
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── Results view ──────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Compact search summary bar */}
        <div className="glass-card rounded-[1.5rem] px-5 py-3 mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">hotel</span>
            {form.city ? `Hotels in ${form.city}` : 'All Hotels'}
          </div>
          {form.checkIn && (
            <span className="text-xs text-on-surface-variant">{form.checkIn}{form.checkOut ? ` → ${form.checkOut}` : ''}</span>
          )}
          {form.guests > 1 && (
            <span className="text-xs text-on-surface-variant">· {form.guests} guests</span>
          )}
          <button
            onClick={handleModify}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Modify Search
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface">
            Hotel Results
          </h1>
          <p className="text-on-surface-variant mt-1">
            {loading ? 'Searching...' : `${filteredHotels.length} hotel${filteredHotels.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <GlassCard className="!p-5">
              <h3 className="font-headline font-bold text-base mb-4">Star Rating</h3>
              <div className="space-y-2">
                {STAR_FILTERS.map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={starFilter.includes(star)}
                      onChange={() => toggleStarFilter(star)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-outline-variant"
                    />
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: star }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-amber-400 text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="!p-5">
              <h3 className="font-headline font-bold text-base mb-4">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                      sortBy === option.id
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-surface-container/50 text-on-surface-variant'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <HotelCardSkeleton count={3} />
            ) : filteredHotels.length === 0 ? (
              <EmptyState
                icon="hotel"
                title="No Hotels Found"
                description="Try adjusting your search criteria or removing filters."
              />
            ) : (
              filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
