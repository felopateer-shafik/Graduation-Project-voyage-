import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import EmptyState from '@/components/common/EmptyState';
import useWishlistStore from '@/store/useWishlistStore';
import HotelCard from '@/components/hotel/HotelCard';
import FlightCard from '@/components/flight/FlightCard';
import { formatCurrency } from '@/utils/formatCurrency';
import WishlistHeart from '@/components/common/WishlistHeart';

function TourWishlistCard({ tour }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/tours/${tour.id}`)}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex gap-4 p-4"
    >
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        {tour.imageUrl ? (
          <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">explore</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-on-surface-variant mb-0.5">{tour.location}</p>
        <h4 className="font-headline font-extrabold text-sm text-on-surface line-clamp-1 mb-1">{tour.title}</h4>
        <p className="text-xs text-on-surface-variant">{tour.duration}</p>
        <p className="font-bold text-primary mt-1">{formatCurrency(tour.price)}<span className="text-[10px] font-normal text-outline">/pp</span></p>
      </div>
      <WishlistHeart item={tour} type="tour" className="shrink-0 self-start !bg-surface-container/60 !border-outline-variant/20 hover:!bg-surface-container" iconClassName="text-on-surface-variant hover:text-error" />
    </article>
  );
}

function PackageWishlistCard({ pkg }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/packages/${pkg.id}`)}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex gap-4 p-4"
    >
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        {pkg.heroImageUrl ? (
          <img src={pkg.heroImageUrl} alt={pkg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-2xl">travel_explore</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-on-surface-variant mb-0.5">{pkg.originCityCode} → {pkg.destinationCityCode}</p>
        <h4 className="font-headline font-extrabold text-sm text-on-surface line-clamp-1 mb-1">{pkg.name}</h4>
        <p className="text-xs text-on-surface-variant">{pkg.nights} nights</p>
        <p className="font-bold text-primary mt-1">{formatCurrency(pkg.pricePerPerson)}<span className="text-[10px] font-normal text-outline">/pp</span></p>
      </div>
      <WishlistHeart item={pkg} type="package" className="shrink-0 self-start !bg-surface-container/60 !border-outline-variant/20 hover:!bg-surface-container" iconClassName="text-on-surface-variant hover:text-error" />
    </article>
  );
}

export default function WishlistPage() {
  const { items, clearWishlist, fetchWishlist, isLoading, error } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const hotels = items.filter((i) => i.type === 'hotel');
  const flights = items.filter((i) => i.type === 'flight');
  const tours = items.filter((i) => i.type === 'tour');
  const packages = items.filter((i) => i.type === 'package');

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight">My Wishlist</h1>
            {items.length > 0 && (
              <p className="text-on-surface-variant text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              disabled={isLoading}
              className="text-sm font-bold text-error hover:text-error/80 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Clearing...' : 'Clear All'}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-semibold text-error">
            {error}
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-[1.5rem] bg-surface-container/50 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="favorite"
            title="Your Wishlist is Empty"
            description="Save hotels, flights, tours and packages you love to find them easily later."
          />
        ) : (
          <div className="flex flex-col gap-10">
            {hotels.length > 0 && (
              <section>
                <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">hotel</span>
                  Saved Hotels
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
                </div>
              </section>
            )}

            {flights.length > 0 && (
              <section>
                <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">flight</span>
                  Saved Flights
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {flights.map((flight) => <FlightCard key={flight.id} flight={flight} />)}
                </div>
              </section>
            )}

            {tours.length > 0 && (
              <section>
                <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">explore</span>
                  Saved Tours
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tours.map((tour) => <TourWishlistCard key={tour.id} tour={tour} />)}
                </div>
              </section>
            )}

            {packages.length > 0 && (
              <section>
                <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">travel_explore</span>
                  Saved Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => <PackageWishlistCard key={pkg.id} pkg={pkg} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
