import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import WishlistHeart from '@/components/common/WishlistHeart';
import { toursAPI } from '@/api/tours';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

const TOUR_TYPES = [
  { id: 'all', label: 'All Tours' },
  { id: 'PRIVATE', label: 'Private' },
  { id: 'GROUP', label: 'Group' },
];

function TourCard({ tour }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/tours/${tour.id}`)}
      className="glass-card rounded-[2rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        {tour.imageUrl ? (
          <img
            src={tour.imageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">explore</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-4">
          <span className={cn(
            'px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest',
            tour.tourType === 'PRIVATE' ? 'bg-primary text-white' : 'bg-secondary/80 text-white'
          )}>
            {tour.tourType}
          </span>
        </div>

        <WishlistHeart item={tour} type="tour" className="absolute top-3 right-3 w-8 h-8" />

        <div className="absolute bottom-3 left-4 flex items-center gap-1 text-white/90">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>location_on</span>
          <span className="text-xs font-bold">{tour.location}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-headline font-extrabold text-base text-on-surface leading-snug line-clamp-2">{tour.title}</h3>

        <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">schedule</span>
            {tour.duration}
          </span>
          {tour.difficulty && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">fitness_center</span>
              {tour.difficulty}
            </span>
          )}
          {tour.maxGroupSize && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">group</span>
              Up to {tour.maxGroupSize}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-white/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-extrabold">From</p>
            <p className="font-headline text-xl font-extrabold text-primary">{formatCurrency(tour.price)}</p>
            <p className="text-[10px] text-outline">per person</p>
          </div>
          {tour.rating > 0 && (
            <div className="flex items-center gap-0.5 text-sm font-bold text-amber-500">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              {tour.rating}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const data = await toursAPI.getAll();
      setTours(Array.isArray(data) ? data : []);
    } catch {
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const filtered = activeType === 'all'
    ? tours
    : tours.filter((t) => t.tourType === activeType);

  return (
    <PageShell>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section className="mb-10">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Curated experiences</p>
          <h1 className="font-headline text-5xl sm:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
            Discover Tours
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            Hand-picked tours across the world's most iconic destinations. Private or group — there's a journey for every traveler.
          </p>
        </section>

        {/* Type filter */}
        <div className="flex gap-3 mb-8">
          {TOUR_TYPES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveType(id)}
              className={cn(
                'px-6 py-2.5 rounded-full font-bold text-sm transition-all',
                activeType === id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'glass-card text-on-surface-variant hover:text-on-surface'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-[2rem] bg-surface-container/50 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">explore_off</span>
            <h2 className="font-headline text-2xl font-bold mb-2">No tours found</h2>
            {activeType !== 'all' && (
              <button onClick={() => setActiveType('all')} className="btn-primary mx-auto mt-4">
                Show All Tours
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
