import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { packagesAPI } from '@/api/packages';
import WishlistHeart from '@/components/common/WishlistHeart';
import { formatCurrency } from '@/utils/formatCurrency';
import { resolveCitySearchTerm } from '@/utils/destinationResolver';
import { cn } from '@/utils/cn';

function PackageCard({ pkg }) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/packages/${pkg.id}`)}
      className="glass-card rounded-[2rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      {/* Hero image */}
      <div className="relative h-52 overflow-hidden">
        {pkg.heroImageUrl ? (
          <img
            src={pkg.heroImageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">travel_explore</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Wishlist */}
        <WishlistHeart item={pkg} type="package" className="absolute top-3 right-3 !w-8 !h-8 z-10" />

        {/* Route badge */}
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-bold text-sm tracking-wide">
            {pkg.originCityCode} → {pkg.destinationCityCode}
          </p>
          <p className="text-xs text-white/80">{pkg.nights} nights</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <h3 className="font-headline font-extrabold text-base text-on-surface leading-snug line-clamp-2">
          {pkg.name}
        </h3>

        {/* Top inclusions (first 3) */}
        {pkg.inclusions?.length > 0 && (
          <ul className="space-y-1">
            {pkg.inclusions.slice(0, 3).map((inc, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                <span className="line-clamp-1">{inc}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-white/20 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-extrabold">From</p>
            <p className="font-headline text-2xl font-extrabold text-on-surface">
              {formatCurrency(pkg.pricePerPerson)}
            </p>
            <p className="text-[10px] text-outline">per person</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FlightHotelPage() {
  const [view, setView] = useState('search');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ origin: '', destination: '', travelers: 2 });

  const fetchPackages = useCallback(async (params) => {
    setLoading(true);
    try {
      const results = await packagesAPI.list(params);
      setPackages(results);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setView('results');
    const [origin, destination] = await Promise.all([
      resolveCitySearchTerm(form.origin),
      resolveCitySearchTerm(form.destination),
    ]);
    await fetchPackages({ origin, destination });
  };

  const handleBrowseAll = async () => {
    setView('results');
    await fetchPackages({});
  };

  // ─── Search view ───────────────────────────────────────────────────────────
  if (view === 'search') {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          {/* Hero */}
          <div className="text-center mb-10">
            <p className="text-sm font-bold tracking-widest text-primary uppercase mb-3">All-inclusive</p>
            <h1 className="font-headline text-5xl sm:text-6xl font-extrabold tracking-tighter text-on-surface">
              Flight + Hotel Packages
            </h1>
            <p className="text-on-surface-variant mt-3 text-base max-w-md mx-auto">
              Curated bundles with flights, accommodation, and guided experiences — all in one booking.
            </p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: 'verified', label: 'Fully Guaranteed', color: 'secondary' },
              { icon: 'sell', label: 'Exclusive Rates', color: 'primary' },
              { icon: 'military_tech', label: 'Earn Points', color: 'tertiary' },
            ].map(({ icon, label, color }) => (
              <div key={label} className="glass-card rounded-2xl p-5 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center',
                  color === 'primary' ? 'bg-primary/10 text-primary' :
                  color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                )}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
                </div>
                <span className="font-bold text-sm text-on-surface">{label}</span>
              </div>
            ))}
          </div>

          {/* Search form */}
          <div className="glass-panel ghost-border rounded-[2rem] p-6 md:p-8 shadow-glass-xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">flight_takeoff</span>
                  <input
                    type="text"
                    placeholder="From (city code e.g. CAI)"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">flight_land</span>
                  <input
                    type="text"
                    placeholder="To (city code e.g. DXB)"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div className="relative max-w-xs">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">group</span>
                <select
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
                  className="input-field pl-11 appearance-none"
                >
                  {[1,2,3,4,5,6,7,8,9].map((n) => (
                    <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 group">
                  <span className="material-symbols-outlined text-xl">search</span>
                  Search Packages
                </button>
                <button type="button" onClick={handleBrowseAll} className="px-5 py-3 rounded-full border-2 border-primary/30 text-primary font-bold hover:bg-primary/5 transition-colors text-sm">
                  Browse All
                </button>
              </div>
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
        {/* Search summary */}
        <div className="glass-card rounded-[1.5rem] px-5 py-3 mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">travel_explore</span>
            {form.origin && form.destination
              ? `${form.origin.toUpperCase()} → ${form.destination.toUpperCase()}`
              : 'All Packages'}
          </div>
          {form.travelers > 1 && (
            <span className="text-xs text-on-surface-variant">· {form.travelers} travelers</span>
          )}
          <button
            onClick={() => setView('search')}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Modify Search
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface">
            {form.destination ? `Packages to ${form.destination.toUpperCase()}` : 'All Packages'}
          </h1>
          <p className="text-on-surface-variant mt-1">
            {loading ? 'Searching...' : `${packages.length} package${packages.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="glass-card rounded-[2rem] h-96 animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">travel_explore</span>
            <h2 className="font-headline text-2xl font-bold mb-2">No Packages Found</h2>
            <p className="text-on-surface-variant mb-6">Try a different destination or browse all packages.</p>
            <button onClick={handleBrowseAll} className="btn-primary mx-auto">Browse All Packages</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
