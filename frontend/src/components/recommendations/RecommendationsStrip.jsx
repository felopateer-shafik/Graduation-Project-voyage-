import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationsAPI } from '@/api/recommendations';
import { formatCurrency } from '@/utils/formatCurrency';
import WishlistHeart from '@/components/common/WishlistHeart';
import { ROUTES } from '@/constants/routes';

function HotelRec({ hotel }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/hotels/${hotel.id}`)}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex-shrink-0 w-64"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <WishlistHeart item={hotel} type="hotel" className="absolute top-2 right-2 w-8 h-8" />
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">{hotel.location}</p>
        <h4 className="font-headline font-extrabold text-sm text-on-surface line-clamp-1">{hotel.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-extrabold text-primary">{formatCurrency(hotel.pricePerNight)}<span className="text-[10px] font-normal text-outline">/night</span></p>
          {hotel.rating > 0 && (
            <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              {hotel.rating}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function TourRec({ tour }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/tours/${tour.id}`)}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex-shrink-0 w-64"
    >
      <div className="relative h-36 overflow-hidden">
        {tour.imageUrl ? (
          <img
            src={tour.imageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">explore</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <WishlistHeart item={tour} type="tour" className="absolute top-2 right-2 w-8 h-8" />
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">{tour.location}</p>
        <h4 className="font-headline font-extrabold text-sm text-on-surface line-clamp-1">{tour.title}</h4>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-extrabold text-primary">{formatCurrency(tour.price)}<span className="text-[10px] font-normal text-outline">/pp</span></p>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{tour.duration}</span>
        </div>
      </div>
    </article>
  );
}

function PackageRec({ pkg }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/packages/${pkg.id}`)}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex-shrink-0 w-64"
    >
      <div className="relative h-36 overflow-hidden">
        {pkg.heroImageUrl ? (
          <img
            src={pkg.heroImageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-tertiary/20 to-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">travel_explore</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <WishlistHeart item={pkg} type="package" className="absolute top-2 right-2 w-8 h-8" />
        <div className="absolute bottom-2 left-3 text-white text-xs font-bold">
          {pkg.originCityCode} → {pkg.destinationCityCode}
        </div>
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">{pkg.nights} nights</p>
        <h4 className="font-headline font-extrabold text-sm text-on-surface line-clamp-1">{pkg.name}</h4>
        <p className="text-sm font-extrabold text-primary mt-2">{formatCurrency(pkg.pricePerPerson)}<span className="text-[10px] font-normal text-outline">/pp</span></p>
      </div>
    </article>
  );
}

function ScrollRow({ children }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}

/**
 * RecommendationsStrip — drops into any page.
 * Shows popular hotels, featured tours, and latest packages as horizontal scroll rows.
 */
export default function RecommendationsStrip({ title = 'You Might Also Like' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recommendationsAPI.get()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return null;

  const hasHotels = data.hotels?.length > 0;
  const hasTours = data.tours?.length > 0;
  const hasPackages = data.packages?.length > 0;
  if (!hasHotels && !hasTours && !hasPackages) return null;

  return (
    <section className="py-12">
      <h2 className="font-headline text-2xl font-extrabold tracking-tighter mb-8">{title}</h2>

      {hasHotels && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-lg">hotel</span>
            <h3 className="font-bold text-base">Top Hotels</h3>
          </div>
          <ScrollRow>
            {data.hotels.map((h) => <HotelRec key={h.id} hotel={h} />)}
          </ScrollRow>
        </div>
      )}

      {hasTours && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-lg">explore</span>
            <h3 className="font-bold text-base">Featured Tours</h3>
          </div>
          <ScrollRow>
            {data.tours.map((t) => <TourRec key={t.id} tour={t} />)}
          </ScrollRow>
        </div>
      )}

      {hasPackages && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-tertiary text-lg">travel_explore</span>
            <h3 className="font-bold text-base">Popular Packages</h3>
          </div>
          <ScrollRow>
            {data.packages.map((p) => <PackageRec key={p.id} pkg={p} />)}
          </ScrollRow>
        </div>
      )}
    </section>
  );
}
