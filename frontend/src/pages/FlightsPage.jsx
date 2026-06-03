import { useState, useEffect, useCallback } from 'react';
import PageShell from '@/components/common/PageShell';
import FlightCard from '@/components/flight/FlightCard';
import { FlightCardSkeleton } from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import GlassCard from '@/components/common/GlassCard';
import { flightsAPI } from '@/api/flights';
import useSearchStore from '@/store/useSearchStore';
import { cn } from '@/utils/cn';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Cheapest' },
  { id: 'price_high', label: 'Highest' },
  { id: 'duration', label: 'Fastest' },
];

const STOP_FILTERS = [
  { id: 'nonstop', label: 'Non-stop' },
  { id: '1stop', label: '1 Stop' },
  { id: '2plus', label: '2+ Stops' },
];

export default function FlightsPage() {
  const { searchParams, setSearchParams } = useSearchStore();

  const [view, setView] = useState('search');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [stopFilter, setStopFilter] = useState([]);

  const [form, setForm] = useState({
    from: searchParams.from || '',
    to: searchParams.to || '',
    departDate: searchParams.departDate || '',
    returnDate: searchParams.returnDate || '',
    travelers: searchParams.travelers || 1,
    tripType: searchParams.tripType || 'roundTrip',
  });

  const setTripType = (type) =>
    setForm((prev) => ({
      ...prev,
      tripType: type,
      returnDate: type === 'oneWay' ? '' : prev.returnDate,
    }));

  const fetchFlights = useCallback(async (params) => {
    setLoading(true);
    try {
      const results =
        params.from && params.to
          ? await flightsAPI.search(params)
          : await flightsAPI.getAll();
      setFlights(results);
    } catch (err) {
      console.error('Failed to fetch flights:', err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // If user arrived from landing-page search, skip straight to results
  useEffect(() => {
    if (searchParams.from && searchParams.to) {
      setView('results');
      fetchFlights(searchParams);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams(form);
    setView('results');
    await fetchFlights(form);
  };

  const handleModify = () => setView('search');

  // Sort
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    return 0;
  });

  // Filter
  const filteredFlights =
    stopFilter.length > 0
      ? sortedFlights.filter((f) => {
          if (stopFilter.includes('nonstop') && f.stops === 0) return true;
          if (stopFilter.includes('1stop') && f.stops === 1) return true;
          if (stopFilter.includes('2plus') && f.stops >= 2) return true;
          return false;
        })
      : sortedFlights;

  const toggleStopFilter = (id) =>
    setStopFilter((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  // ─── Search view ───────────────────────────────────────────────────────────
  if (view === 'search') {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          {/* Hero heading */}
          <div className="text-center mb-10">
            <p className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Where to?</p>
            <h1 className="font-headline text-5xl sm:text-6xl font-extrabold tracking-tighter text-on-surface">
              Search Flights
            </h1>
            <p className="text-on-surface-variant mt-3 text-base max-w-md mx-auto">
              Find the best fares across hundreds of routes. Enter your route below to get started.
            </p>
          </div>

          {/* Search form */}
          <div className="glass-panel ghost-border rounded-[2rem] p-6 md:p-8 shadow-glass-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Trip type toggle */}
              <div className="flex gap-2">
                {[
                  { id: 'roundTrip', label: 'Round-trip', icon: 'sync_alt' },
                  { id: 'oneWay', label: 'One-way', icon: 'arrow_forward' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTripType(opt.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all',
                      form.tripType === opt.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    <span className="material-symbols-outlined text-base">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* From */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                    flight_takeoff
                  </span>
                  <input
                    type="text"
                    placeholder="From (City or Airport)"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="input-field pl-11"
                    required
                  />
                </div>
                {/* To */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                    flight_land
                  </span>
                  <input
                    type="text"
                    placeholder="To (City or Airport)"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="input-field pl-11"
                    required
                  />
                </div>
                {/* Depart */}
                <div className={cn('relative', form.tripType === 'oneWay' && 'sm:col-span-2')}>
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    value={form.departDate}
                    onChange={(e) => setForm({ ...form, departDate: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
                {/* Return — only for round-trip */}
                {form.tripType === 'roundTrip' && (
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                      event_available
                    </span>
                    <input
                      type="date"
                      value={form.returnDate}
                      min={form.departDate || undefined}
                      onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      className="input-field pl-11"
                    />
                  </div>
                )}
              </div>

              {/* Travelers */}
              <div className="relative max-w-xs">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  group
                </span>
                <select
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
                  className="input-field pl-11 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      {n} Traveler{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full group">
                <span className="material-symbols-outlined text-xl">search</span>
                Search Flights
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
            <span className="material-symbols-outlined text-primary text-base">flight</span>
            {searchParams.from && searchParams.to
              ? `${searchParams.from} → ${searchParams.to}`
              : 'All Flights'}
          </div>
          {searchParams.departDate && (
            <span className="text-xs text-on-surface-variant">
              {searchParams.departDate}
              {searchParams.tripType !== 'oneWay' && searchParams.returnDate && ` → ${searchParams.returnDate}`}
            </span>
          )}
          {searchParams.travelers > 1 && (
            <span className="text-xs text-on-surface-variant">· {searchParams.travelers} travelers</span>
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
            Flight Results
          </h1>
          <p className="text-on-surface-variant mt-1">
            {loading ? 'Searching...' : `${filteredFlights.length} flight${filteredFlights.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <GlassCard className="!p-5">
              <h3 className="font-headline font-bold text-base mb-4">Stops</h3>
              <div className="space-y-2">
                {STOP_FILTERS.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={stopFilter.includes(filter.id)}
                      onChange={() => toggleStopFilter(filter.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-outline-variant"
                    />
                    <span className="text-sm font-medium">{filter.label}</span>
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
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <FlightCardSkeleton count={4} />
            ) : filteredFlights.length === 0 ? (
              <EmptyState
                icon="flight"
                title="No Flights Found"
                description="Try adjusting your search criteria or removing filters."
              />
            ) : (
              filteredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
