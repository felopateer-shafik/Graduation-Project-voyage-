import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import WishlistHeart from '@/components/common/WishlistHeart';

const AMENITY_ICONS = {
  wifi: 'wifi', pool: 'pool', spa: 'spa', gym: 'fitness_center',
  restaurant: 'restaurant', bar: 'local_bar', room_service: 'room_service',
  parking: 'local_parking', concierge: 'concierge', waterpark: 'waves',
  aquarium: 'pets',
};

/**
 * Hotel result card
 * @param {{ hotel: object }} props
 */
export default function HotelCard({ hotel }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hotels/${hotel.id}`)}
      className="glass-card rounded-[2rem] overflow-hidden shadow-glass hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-72 shrink-0 h-48 sm:h-auto overflow-hidden">
          <img
            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          {hotel.discount > 0 && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-tertiary text-white text-xs font-bold">
              {hotel.discount}% OFF
            </div>
          )}
          {hotel.freeCancellation && (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
              Free Cancellation
            </div>
          )}
          <WishlistHeart
            item={hotel}
            type="hotel"
            className="absolute top-4 right-4 !w-8 !h-8 !bg-white/80 hover:!bg-white !border-white/50 z-20 shadow-sm"
            iconClassName="text-on-surface-variant hover:text-error"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {hotel.tags?.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-headline font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <p className="text-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-outline">location_on</span>
              {hotel.location}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-base text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="ml-2 text-xs font-bold text-on-surface">{hotel.rating}</span>
              <span className="text-xs text-outline">({hotel.reviewCount} reviews)</span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mt-3">
              {hotel.amenities.slice(0, 5).map(amenity => (
                <span key={amenity} title={amenity} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">{AMENITY_ICONS[amenity] || amenity}</span>
                </span>
              ))}
              {hotel.amenities.length > 5 && (
                <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  +{hotel.amenities.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-outline-variant/10">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline">{hotel.roomType}</p>
              <p className="text-xs text-outline">{hotel.roomSize} · {hotel.bedType}</p>
            </div>
            <div className="text-right">
              {hotel.originalPrice && (
                <span className="text-xs text-outline line-through block">{formatCurrency(hotel.originalPrice)}</span>
              )}
              <p className="font-headline text-2xl font-extrabold">{formatCurrency(hotel.pricePerNight)}</p>
              <p className="text-[10px] text-outline font-bold uppercase">per night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
