import { useLocation, Link } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import GlassPanel from '@/components/common/GlassPanel';
import RecommendationsStrip from '@/components/recommendations/RecommendationsStrip';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';

export default function BookingConfirmationPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <PageShell showFooter={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] text-center px-4">
          <div>
            <h2 className="font-headline text-2xl font-bold mb-2">No booking data</h2>
            <Link to={ROUTES.HOME} className="btn-primary mt-6 inline-flex">Go Home</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const isHotel = booking.type === 'hotel';
  const isTour = booking.type === 'tour';
  const isPackage = booking.type === 'package';
  const item = booking.item;

  return (
    <PageShell showFooter={false}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center mx-auto mb-6 shadow-primary-glow animate-scale-in">
            <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-on-surface-variant text-lg">
            Your reservation is all set. Check your email for details.
          </p>
        </div>

        {/* Confirmation Card */}
        <GlassPanel className="!p-8 sm:!p-10">
          {/* Confirmation Code */}
          <div className="text-center mb-8 pb-8 border-b border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-2">Confirmation Code</p>
            <p className="font-headline text-4xl font-black text-primary tracking-wider">{booking.confirmationCode}</p>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Booking Type</p>
              <p className="font-bold text-base capitalize">{booking.type}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Status</p>
              <span className="badge-confirmed">{booking.status}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                {isPackage ? 'Package' : isTour ? 'Tour' : isHotel ? 'Hotel' : 'Route'}
              </p>
              <p className="font-bold text-base">
                {isPackage
                  ? `${item?.originCityCode} → ${item?.destinationCityCode}`
                  : isTour
                    ? item?.title || item?.name
                    : isHotel
                      ? item?.name
                      : `${item?.from?.city || item?.departureCity || '—'} → ${item?.to?.city || item?.arrivalCity || '—'}`
                }
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Total Paid</p>
              <p className="font-headline text-2xl font-black">{formatCurrency(booking.totalAmount)}</p>
            </div>
          </div>

          {/* Loyalty Points */}
          {booking.loyaltyPointsEarned > 0 && (
            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <div className="flex items-center gap-3 bg-primary/5 rounded-2xl p-4">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>loyalty</span>
                <div>
                  <p className="font-bold text-sm">You earned {booking.loyaltyPointsEarned} Voyage Points!</p>
                  <p className="text-xs text-on-surface-variant">Points will be added to your account</p>
                </div>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to={ROUTES.BOOKINGS} className="btn-primary">
            <span className="material-symbols-outlined text-xl">confirmation_number</span>
            View My Bookings
          </Link>
          <Link to={ROUTES.HOME} className="btn-secondary">
            Back to Home
          </Link>
        </div>

        <RecommendationsStrip title="Continue Exploring" />
      </div>
    </PageShell>
  );
}
