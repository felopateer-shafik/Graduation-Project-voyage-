import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { citiesAPI } from '@/api/cities';
import { hotelsAPI } from '@/api/hotels';
import { toursAPI } from '@/api/tours';
import { packagesAPI } from '@/api/packages';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';

function RelatedCard({ title, subtitle, imageUrl, fallbackIcon, onClick, price }) {
  return (
    <article
      onClick={onClick}
      className="glass-card rounded-[1.5rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300"
    >
      <div className="h-36 overflow-hidden bg-primary/10">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">{fallbackIcon}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-headline font-extrabold text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{subtitle}</p>
        {price !== undefined && (
          <p className="text-sm font-black text-primary mt-3">{formatCurrency(price)}</p>
        )}
      </div>
    </article>
  );
}

export default function CityDetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const cityData = await citiesAPI.getByCode(code);
        setCity(cityData);
        const [hotelData, tourData, packageData] = await Promise.all([
          hotelsAPI.search({ city: cityData.name }),
          toursAPI.search(cityData.name),
          packagesAPI.list({ destination: cityData.code }),
        ]);
        setHotels(hotelData);
        setTours(Array.isArray(tourData) ? tourData : []);
        setPackages(packageData);
      } catch {
        setError('City not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  const activityText = useMemo(() => {
    if (!city?.popularActivities) return [];
    if (Array.isArray(city.popularActivities)) {
      return city.popularActivities.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(city.popularActivities).split(',').map((item) => item.trim()).filter(Boolean);
  }, [city]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="h-80 rounded-[2rem] bg-surface-container/50 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-[1.5rem] bg-surface-container/50 animate-pulse" />)}
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !city) {
    return (
      <PageShell>
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">location_off</span>
          <h2 className="font-headline text-2xl font-bold mb-2">City Not Found</h2>
          <button onClick={() => navigate(ROUTES.EXPLORE)} className="btn-primary mx-auto mt-4">Back to Explore</button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
          <button onClick={() => navigate(ROUTES.EXPLORE)} className="font-medium hover:text-primary transition-colors">Explore</button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">{city.name}</span>
        </nav>

        <section className="relative rounded-[2rem] overflow-hidden h-80 sm:h-[28rem] mb-8">
          {city.heroImageUrl ? (
            <img src={city.heroImageUrl} alt={city.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-7xl">location_city</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-8 left-6 right-6 text-white">
            <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-2">{city.countryCode}</p>
            <h1 className="font-headline text-4xl sm:text-6xl font-extrabold tracking-tight">{city.name}</h1>
            <p className="max-w-2xl text-sm sm:text-base text-white/85 mt-3 leading-relaxed">{city.description}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="glass-card rounded-[2rem] p-6 lg:col-span-2">
            <h2 className="font-headline text-xl font-extrabold mb-3">City Snapshot</h2>
            <p className="text-on-surface-variant leading-relaxed">{city.description}</p>
            {activityText.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {activityText.map((activity) => (
                  <span key={activity} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {activity}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="font-headline text-xl font-extrabold mb-4">Location</h2>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">Code</span><span className="font-bold">{city.code}</span></p>
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">Country</span><span className="font-bold">{city.countryCode}</span></p>
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">Coordinates</span><span className="font-bold text-right">{city.latitude}, {city.longitude}</span></p>
            </div>
          </div>
        </div>

        {city.landmarks?.length > 0 && (
          <section className="mb-10">
            <h2 className="font-headline text-2xl font-extrabold mb-5">Landmarks in {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.landmarks.map((landmark) => (
                <RelatedCard
                  key={landmark.id}
                  title={landmark.name}
                  subtitle={landmark.category}
                  imageUrl={landmark.imageUrl}
                  fallbackIcon="photo_camera"
                  onClick={() => navigate(`/landmarks/${landmark.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 3).map((hotel) => (
            <RelatedCard key={`h-${hotel.id}`} title={hotel.name} subtitle={hotel.location} imageUrl={hotel.imageUrl || hotel.images?.[0]} fallbackIcon="hotel" price={hotel.pricePerNight} onClick={() => navigate(`/hotels/${hotel.id}`)} />
          ))}
          {tours.slice(0, 3).map((tour) => (
            <RelatedCard key={`t-${tour.id}`} title={tour.title} subtitle={tour.duration || tour.location} imageUrl={tour.imageUrl} fallbackIcon="explore" price={tour.price} onClick={() => navigate(`/tours/${tour.id}`)} />
          ))}
          {packages.slice(0, 3).map((pkg) => (
            <RelatedCard key={`p-${pkg.id}`} title={pkg.name} subtitle={`${pkg.nights} nights`} imageUrl={pkg.heroImageUrl} fallbackIcon="travel_explore" price={pkg.pricePerPerson} onClick={() => navigate(`/packages/${pkg.id}`)} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
