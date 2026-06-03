import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import GlassPanel from '@/components/common/GlassPanel';
import GlassCard from '@/components/common/GlassCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { hotelsAPI } from '@/api/hotels';
import { formatCurrency } from '@/utils/formatCurrency';
import useBookingStore from '@/store/useBookingStore';
import WishlistHeart from '@/components/common/WishlistHeart';
import ReviewList from '@/components/reviews/ReviewList';
import { ROUTES } from '@/constants/routes';
import { calculateBookingEstimate } from '@/utils/bookingPricing';

const AMENITY_LABELS = {
  wifi: 'Free Wi-Fi', pool: 'Swimming Pool', spa: 'Spa & Wellness', gym: 'Fitness Center',
  restaurant: 'Restaurant', bar: 'Bar & Lounge', room_service: 'Room Service',
  parking: 'Free Parking', concierge: 'Concierge', waterpark: 'Waterpark', aquarium: 'Aquarium',
};

const AMENITY_ICONS = {
  wifi: 'wifi', pool: 'pool', spa: 'spa', gym: 'fitness_center',
  restaurant: 'restaurant', bar: 'local_bar', room_service: 'room_service',
  parking: 'local_parking', concierge: 'concierge', waterpark: 'waves', aquarium: 'pets',
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingItem } = useBookingStore();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationDetails, setReservationDetails] = useState({
    rooms: 1,
    days: 1,
    guests: 1,
  });

  useEffect(() => {
    async function fetchHotel() {
      setLoading(true);
      try {
        const data = await hotelsAPI.getById(id);
        setHotel(data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [id]);

  const handleReservationChange = (field, value) => {
    setReservationDetails((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCheckout = () => {
    const estimate = calculateBookingEstimate({ type: 'hotel', item: hotel, details: reservationDetails });
    setBookingItem(hotel, 'hotel', estimate.details);
    navigate(ROUTES.CHECKOUT);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
          <LoadingSkeleton variant="text" className="!h-10 !w-80" />
          <LoadingSkeleton variant="card" className="!h-96" />
        </div>
      </PageShell>
    );
  }

  if (!hotel) {
    return (
      <PageShell>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="font-headline text-3xl font-bold">Hotel Not Found</h1>
        </div>
      </PageShell>
    );
  }

  const estimate = calculateBookingEstimate({ type: 'hotel', item: hotel, details: reservationDetails });

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm">
          <button onClick={() => navigate(-1)} className="font-medium hover:text-primary transition-colors">Hotels</button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">{hotel.name}</span>
        </nav>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[400px] rounded-[2rem] overflow-hidden">
          <div className="col-span-2 row-span-2 relative group">
            <img
              src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
          {hotel.images?.slice(1, 5).map((img, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img src={img} alt={`${hotel.name} ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          )) || (
            <div className="col-span-2 row-span-2 bg-surface-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-outline">image</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Hotel Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.tags?.map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/5 px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">{hotel.name}</h1>
                <WishlistHeart item={hotel} type="hotel" className="shrink-0 !bg-surface-container/60 !border-outline-variant/20 hover:!bg-surface-container" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="font-bold text-sm">{hotel.rating} <span className="text-on-surface-variant font-normal">({hotel.reviewCount} reviews)</span></span>
                <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {hotel.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <GlassCard className="!p-6">
              <h3 className="font-headline font-bold text-lg mb-3">About</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{hotel.description}</p>
            </GlassCard>

            {/* Room Details */}
            <GlassCard className="!p-6">
              <h3 className="font-headline font-bold text-lg mb-4">Room Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Room Type</p>
                  <p className="font-bold text-sm">{hotel.roomType}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Room Size</p>
                  <p className="font-bold text-sm">{hotel.roomSize}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Bed Type</p>
                  <p className="font-bold text-sm">{hotel.bedType}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">View</p>
                  <p className="font-bold text-sm">{hotel.view}</p>
                </div>
              </div>
            </GlassCard>

            {/* Amenities */}
            <GlassCard className="!p-6">
              <h3 className="font-headline font-bold text-lg mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container/30">
                    <span className="material-symbols-outlined text-primary text-xl">{AMENITY_ICONS[amenity] || amenity}</span>
                    <span className="text-sm font-medium">{AMENITY_LABELS[amenity] || amenity}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            {/* Reviews */}
            <ReviewList targetType="HOTEL" targetId={hotel.id} />
          </div>

          {/* Right: Booking Card */}
          <div className="space-y-6">
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-[2rem] p-8 flex flex-col gap-5 ghost-border-light sticky top-28">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  {hotel.originalPrice && (
                    <span className="text-sm text-outline line-through">{formatCurrency(hotel.originalPrice)}</span>
                  )}
                  <span className="font-headline text-3xl font-black">{formatCurrency(hotel.pricePerNight)}</span>
                </div>
                <p className="text-xs text-outline font-bold uppercase">per night</p>
              </div>

              {hotel.discount > 0 && (
                <div className="flex items-center gap-2 bg-tertiary/10 px-3 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
                  <span className="text-sm text-tertiary font-bold">{hotel.discount}% discount applied</span>
                </div>
              )}

              {hotel.freeCancellation && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm text-green-700 font-bold">Free cancellation</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <label htmlFor="hotel-rooms" className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-outline">Rooms</span>
                  <input
                    id="hotel-rooms"
                    type="number"
                    min="1"
                    max={hotel.availableRooms || undefined}
                    value={reservationDetails.rooms}
                    onChange={(event) => handleReservationChange('rooms', event.target.value)}
                    className="w-full rounded-xl border border-outline-variant/20 bg-white/60 px-3 py-2 text-sm font-bold focus:border-primary focus:outline-none"
                  />
                </label>
                <label htmlFor="hotel-days" className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-outline">Days</span>
                  <input
                    id="hotel-days"
                    type="number"
                    min="1"
                    value={reservationDetails.days}
                    onChange={(event) => handleReservationChange('days', event.target.value)}
                    className="w-full rounded-xl border border-outline-variant/20 bg-white/60 px-3 py-2 text-sm font-bold focus:border-primary focus:outline-none"
                  />
                </label>
                <label htmlFor="hotel-guests" className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-outline">Guests</span>
                  <input
                    id="hotel-guests"
                    type="number"
                    min="1"
                    value={reservationDetails.guests}
                    onChange={(event) => handleReservationChange('guests', event.target.value)}
                    className="w-full rounded-xl border border-outline-variant/20 bg-white/60 px-3 py-2 text-sm font-bold focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <p className="text-xs text-outline font-semibold">
                {hotel.availableRooms} rooms available
              </p>

              <div className="h-px bg-outline-variant/10" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{estimate.quantityLabel}</span>
                  <span className="font-semibold">{formatCurrency(estimate.total)}</span>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-primary">Total</span>
                  <span>{formatCurrency(estimate.total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full group">
                Reserve Now
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>


              {hotel.loyaltyPoints > 0 && (
                <p className="text-[10px] text-center text-primary font-bold uppercase tracking-wider">
                  Earn {hotel.loyaltyPoints} Voyage Points
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
