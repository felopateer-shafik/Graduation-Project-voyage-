import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { citiesAPI } from '@/api/cities';
import { hotelsAPI } from '@/api/hotels';
import { toursAPI } from '@/api/tours';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';

function MiniCard({ title, subtitle, imageUrl, icon, onClick, price }) {
  return (
    <article onClick={onClick} className="glass-card rounded-[1.5rem] p-4 flex gap-4 cursor-pointer hover:shadow-card-hover transition-all">
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-headline font-extrabold text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{subtitle}</p>
        {price !== undefined && <p className="text-xs font-black text-primary mt-2">{formatCurrency(price)}</p>}
      </div>
    </article>
  );
}

export default function LandmarkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [landmark, setLandmark] = useState(null);
  const [city, setCity] = useState(null);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [nearbyTours, setNearbyTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const landmarkData = await citiesAPI.getLandmarkById(id);
        setLandmark(landmarkData);
        const cityData = await citiesAPI.getByCode(landmarkData.cityCode);
        setCity(cityData);
        const [hotels, tours] = await Promise.all([
          hotelsAPI.search({ city: cityData.name }),
          toursAPI.search(cityData.name),
        ]);
        setNearbyHotels(hotels);
        setNearbyTours(Array.isArray(tours) ? tours : []);
      } catch {
        setError('Landmark not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="h-96 rounded-[2rem] bg-surface-container/50 animate-pulse" />
          <div className="h-48 rounded-[2rem] bg-surface-container/50 animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (error || !landmark) {
    return (
      <PageShell>
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">wrong_location</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Landmark Not Found</h2>
          <button onClick={() => navigate(ROUTES.EXPLORE)} className="btn-primary mx-auto mt-4">Back to Explore</button>
        </div>
      </PageShell>
    );
  }

  const relatedLandmarks = (city?.landmarks || []).filter((item) => item.id !== landmark.id);

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
          <button onClick={() => navigate(ROUTES.EXPLORE)} className="font-medium hover:text-primary transition-colors">Explore</button>
          {city && (
            <>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <button onClick={() => navigate(`/cities/${city.code}`)} className="font-medium hover:text-primary transition-colors">{city.name}</button>
            </>
          )}
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold truncate">{landmark.name}</span>
        </nav>

        <section className="relative rounded-[2rem] overflow-hidden h-80 sm:h-[30rem] mb-8">
          {landmark.imageUrl ? (
            <img src={landmark.imageUrl} alt={landmark.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-7xl">photo_camera</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-8 left-6 right-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{landmark.category}</span>
              {landmark.hiddenGem && <span className="bg-secondary/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Hidden Gem</span>}
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{landmark.cityCode}</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-6xl font-extrabold tracking-tight">{landmark.name}</h1>
            <p className="max-w-2xl text-sm sm:text-base text-white/85 mt-3 leading-relaxed">{landmark.description}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="glass-card rounded-[2rem] p-6 lg:col-span-2">
            <h2 className="font-headline text-xl font-extrabold mb-3">About This Place</h2>
            <p className="text-on-surface-variant leading-relaxed">{landmark.description}</p>
          </div>
          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="font-headline text-xl font-extrabold mb-4">Location Data</h2>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">City</span><button onClick={() => city && navigate(`/cities/${city.code}`)} className="font-bold text-primary">{city?.name || landmark.cityCode}</button></p>
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">Latitude</span><span className="font-bold">{landmark.latitude || 'N/A'}</span></p>
              <p className="flex justify-between gap-4"><span className="text-on-surface-variant">Longitude</span><span className="font-bold">{landmark.longitude || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="space-y-4">
            <h2 className="font-headline text-xl font-extrabold">Related Landmarks</h2>
            {relatedLandmarks.length === 0 ? (
              <div className="glass-card rounded-[1.5rem] p-6 text-sm text-on-surface-variant">No related landmarks yet.</div>
            ) : relatedLandmarks.slice(0, 4).map((item) => (
              <MiniCard key={item.id} title={item.name} subtitle={item.category} imageUrl={item.imageUrl} icon="place" onClick={() => navigate(`/landmarks/${item.id}`)} />
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-xl font-extrabold">Nearby Hotels</h2>
            {nearbyHotels.length === 0 ? (
              <div className="glass-card rounded-[1.5rem] p-6 text-sm text-on-surface-variant">No nearby hotels available yet.</div>
            ) : nearbyHotels.slice(0, 4).map((hotel) => (
              <MiniCard key={hotel.id} title={hotel.name} subtitle={hotel.location} imageUrl={hotel.imageUrl || hotel.images?.[0]} icon="hotel" price={hotel.pricePerNight} onClick={() => navigate(`/hotels/${hotel.id}`)} />
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-xl font-extrabold">Nearby Tours</h2>
            {nearbyTours.length === 0 ? (
              <div className="glass-card rounded-[1.5rem] p-6 text-sm text-on-surface-variant">No nearby tours available yet.</div>
            ) : nearbyTours.slice(0, 4).map((tour) => (
              <MiniCard key={tour.id} title={tour.title} subtitle={tour.duration || tour.location} imageUrl={tour.imageUrl} icon="explore" price={tour.price} onClick={() => navigate(`/tours/${tour.id}`)} />
            ))}
          </section>
        </div>
      </div>
    </PageShell>
  );
}

