import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { packagesAPI } from '@/api/packages';
import useBookingStore from '@/store/useBookingStore';
import WishlistHeart from '@/components/common/WishlistHeart';
import ReviewList from '@/components/reviews/ReviewList';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';
import { calculateBookingEstimate } from '@/utils/bookingPricing';

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingItem } = useBookingStore();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    packagesAPI.getById(id)
      .then(setPkg)
      .catch(() => setError('Package not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <div className="h-72 rounded-[2rem] bg-surface-container/50 animate-pulse" />
          <div className="h-8 w-2/3 rounded-xl bg-surface-container/50 animate-pulse" />
          <div className="h-4 w-full rounded-xl bg-surface-container/50 animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (error || !pkg) {
    return (
      <PageShell>
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">travel_explore</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Package Not Found</h2>
          <button onClick={() => navigate(ROUTES.FLIGHT_HOTEL)} className="btn-primary mx-auto mt-4">
            Browse Packages
          </button>
        </div>
      </PageShell>
    );
  }

  const estimate = calculateBookingEstimate({ type: 'package', item: pkg });
  const total = estimate.total;

  const handleBook = () => {
    setBookingItem({ ...pkg, price: total }, 'package');
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back nav */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
          <button onClick={() => navigate(ROUTES.FLIGHT_HOTEL)} className="font-medium hover:text-primary transition-colors">
            Packages
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold truncate max-w-xs">{pkg.name}</span>
        </nav>

        {/* Hero image */}
        <div className="relative rounded-[2rem] overflow-hidden h-72 sm:h-96 mb-8">
          {pkg.heroImageUrl ? (
            <img src={pkg.heroImageUrl} alt={pkg.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-7xl">travel_explore</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                  {pkg.originCityCode} → {pkg.destinationCityCode}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                  {pkg.nights} nights
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {pkg.name}
              </h1>
            </div>
            <WishlistHeart item={pkg} type="package" className="shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-card rounded-[2rem] p-8">
              <h2 className="font-headline text-xl font-extrabold mb-4">Overview</h2>
              <p className="text-on-surface-variant leading-relaxed">{pkg.description}</p>
            </div>

            {/* Inclusions */}
            {pkg.inclusions?.length > 0 && (
              <div className="glass-card rounded-[2rem] p-8">
                <h2 className="font-headline text-xl font-extrabold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  What's Included
                </h2>
                <ul className="space-y-2.5">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-green-600 text-base mt-0.5 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="glass-card rounded-[2rem] p-8">
                <h2 className="font-headline text-xl font-extrabold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.dayNumber} className="flex gap-4">
                      {/* Day number */}
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                        {day.dayNumber}
                      </div>
                      <div className="flex-1 pb-6 border-b border-white/20 last:border-0 last:pb-0">
                        <h3 className="font-bold text-on-surface mb-1">{day.title}</h3>
                        <p className="text-sm text-on-surface-variant mb-3">{day.description}</p>
                        {day.activities?.length > 0 && (
                          <ul className="space-y-1">
                            {day.activities.map((act, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-on-surface-variant">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {act}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Reviews */}
            <ReviewList targetType="PACKAGE" targetId={pkg.id} />
          </div>

          {/* Sticky booking card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-[2rem] p-8 sticky top-28 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-outline font-extrabold mb-1">Package total</p>
                <p className="font-headline text-4xl font-extrabold text-on-surface">
                  {formatCurrency(total)}
                </p>
                <p className="text-xs text-outline mt-1">
                  {formatCurrency(pkg.pricePerPerson)} per person · {pkg.nights} nights included
                </p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 text-sm border-t border-white/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Paid bundle price</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between font-black text-base pt-2 border-t border-white/20">
                  <span className="text-primary">Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="btn-primary w-full group"
              >
                Book This Package
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
                <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                <span className="text-xs text-green-700 font-bold">Free cancellation available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
