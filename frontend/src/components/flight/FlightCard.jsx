import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import WishlistHeart from '@/components/common/WishlistHeart';

const AIRLINE_COLORS = {
  EA: 'bg-red-600', MS: 'bg-red-600', TK: 'bg-red-700', EK: 'bg-green-700',
  LH: 'bg-blue-900', QR: 'bg-purple-800', SM: 'bg-orange-600', BA: 'bg-blue-800',
  FZ: 'bg-sky-600', AF: 'bg-indigo-700', SV: 'bg-emerald-700', NP: 'bg-teal-600',
};

const TIME_LABEL_COLORS = {
  Early_Morning: 'text-amber-600 bg-amber-50',
  Morning: 'text-sky-600 bg-sky-50',
  Afternoon: 'text-orange-600 bg-orange-50',
  Evening: 'text-indigo-600 bg-indigo-50',
  Night: 'text-slate-600 bg-slate-100',
};

/**
 * Flight result card with time-of-day labels and days left
 * @param {{ flight: object }} props
 */
export default function FlightCard({ flight }) {
  const navigate = useNavigate();

  const depColor = TIME_LABEL_COLORS[flight.departureTimeLabel] || 'text-on-surface-variant bg-surface-container';
  const arrColor = TIME_LABEL_COLORS[flight.arrivalTimeLabel] || 'text-on-surface-variant bg-surface-container';

  return (
    <div
      onClick={() => navigate(`/flights/${flight.id}`)}
      className="glass-card rounded-[2rem] p-6 md:p-8 shadow-glass hover:shadow-card-hover transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-7xl">flight</span>
      </div>

      {/* Wishlist Button */}
      <WishlistHeart
        item={flight}
        type="flight"
        className="absolute top-4 right-4 !w-8 !h-8 !bg-surface-container hover:!bg-white !border-outline-variant/20 z-20 shadow-sm"
        iconClassName="text-on-surface-variant hover:text-error"
      />

      <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
        {/* Airline Info */}
        <div className="flex items-center gap-3 md:w-40 shrink-0">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold', AIRLINE_COLORS[flight.airlineLogo] || 'bg-primary')}>
            {flight.airlineLogo}
          </div>
          <div>
            <p className="font-bold text-sm">{flight.airline}</p>
            <p className="text-xs text-outline">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Path */}
        <div className="flex-1 flex items-center gap-4 md:gap-6">
          {/* Departure */}
          <div className="text-center md:text-left">
            <p className="font-headline text-2xl font-extrabold leading-none">{flight.from.code}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{flight.from.city}</p>
            <span className={cn('inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1', depColor)}>
              {flight.departureTimeLabel?.replace('_', ' ')}
            </span>
          </div>

          {/* Path Line */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {flight.duration}
            </span>
            <div className="w-full h-px flight-path-dash relative flex items-center justify-center">
              <span className="material-symbols-outlined text-primary absolute bg-background p-0.5 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                flight
              </span>
            </div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
              {flight.stopLabel}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-center md:text-right">
            <p className="font-headline text-2xl font-extrabold leading-none">{flight.to.code}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{flight.to.city}</p>
            <span className={cn('inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1', arrColor)}>
              {flight.arrivalTimeLabel?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Price & Meta */}
        <div className="md:text-right md:w-44 shrink-0 flex md:flex-col items-center md:items-end gap-3 md:gap-0">
          {flight.daysLeft != null && flight.daysLeft > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-1">
              {flight.daysLeft} day{flight.daysLeft !== 1 ? 's' : ''} left
            </span>
          )}
          {flight.discount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
              {flight.discount}% OFF
            </span>
          )}
          <div className="flex items-baseline gap-1">
            {flight.originalPrice && (
              <span className="text-sm text-outline line-through">{formatCurrency(flight.originalPrice)}</span>
            )}
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface">
            {formatCurrency(flight.price)}
          </p>
          <p className="text-[10px] text-outline font-bold uppercase">{flight.class}</p>
          <p className={cn(
            'text-[10px] font-bold uppercase mt-1',
            flight.refundable ? 'text-green-700' : 'text-on-surface-variant'
          )}>
            {flight.refundable ? 'Refundable' : 'Non-refundable'}
          </p>
          {flight.seatsLeft <= 5 && (
            <p className="text-xs text-error font-bold mt-1">
              Only {flight.seatsLeft} left!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
