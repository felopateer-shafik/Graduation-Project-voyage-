import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageShell from '@/components/common/PageShell';
import GlassCard from '@/components/common/GlassCard';
import GlassPanel from '@/components/common/GlassPanel';
import { DetailPageSkeleton } from '@/components/common/LoadingSkeleton';
import { toursAPI } from '@/api/tours';
import { formatCurrency } from '@/utils/formatCurrency';
import useBookingStore from '@/store/useBookingStore';
import WishlistHeart from '@/components/common/WishlistHeart';
import ReviewList from '@/components/reviews/ReviewList';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingItem } = useBookingStore();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTour() {
      setLoading(true);
      try {
        const data = await toursAPI.getById(id);
        setTour(data);
      } catch (err) {
        console.error('Failed to load tour:', err);
        toast.error('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  const handleBookTour = () => {
    setBookingItem(tour, 'tour');
    navigate(ROUTES.CHECKOUT);
  };

  if (loading) {
    return (
      <PageShell>
        <DetailPageSkeleton />
      </PageShell>
    );
  }

  if (!tour) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">explore_off</span>
            <h2 className="font-headline text-2xl font-bold mb-2">Tour Not Found</h2>
            <p className="text-on-surface-variant mb-6">This tour doesn't exist or has been removed.</p>
            <button onClick={() => navigate(ROUTES.TOURS)} className="btn-primary">
              Browse Tours
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const difficultyColor = {
    Easy: 'text-green-600 bg-green-50',
    Moderate: 'text-amber-600 bg-amber-50',
    Challenging: 'text-red-600 bg-red-50',
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
          <button onClick={() => navigate(ROUTES.TOURS)} className="font-medium hover:text-primary transition-colors">Tours</button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold truncate">{tour.title}</span>
        </nav>

        {/* Hero Image */}
        {tour.imageUrl && (
          <div className="relative h-64 sm:h-80 rounded-[2rem] overflow-hidden mb-8">
            <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
              <div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-bold', difficultyColor[tour.difficulty] || 'text-gray-600 bg-gray-50')}>
                  {tour.difficulty}
                </span>
                <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {tour.title}
                </h1>
              </div>
              <WishlistHeart item={tour} type="tour" className="shrink-0" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: 'location_on', label: 'Location', value: tour.location },
                { icon: 'schedule', label: 'Duration', value: tour.duration },
                { icon: 'group', label: 'Max Group', value: `${tour.maxGroupSize || 15} people` },
                { icon: 'category', label: 'Category', value: tour.category },
              ].map((stat) => (
                <GlassCard key={stat.label} className="!p-4 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-1 block">{stat.icon}</span>
                  <p className="text-xs text-on-surface-variant">{stat.label}</p>
                  <p className="font-bold text-sm">{stat.value}</p>
                </GlassCard>
              ))}
            </div>

            {/* Description */}
            <GlassPanel>
              <h2 className="font-headline text-xl font-bold mb-4">About This Tour</h2>
              <p className="text-on-surface-variant leading-relaxed">{tour.description}</p>
            </GlassPanel>

            {/* Reviews */}
            <ReviewList targetType="TOUR" targetId={tour.id} />
          </div>

          {/* Right: Booking Panel */}
          <div>
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-[2rem] p-8 flex flex-col gap-5 ghost-border-light sticky top-28">
              <div>
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wide">From</p>
                <p className="font-headline text-3xl font-extrabold">{formatCurrency(tour.price)}</p>
                <p className="text-xs text-outline">per person</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Duration</span>
                  <span className="font-semibold">{tour.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Difficulty</span>
                  <span className={cn('font-semibold px-2 py-0.5 rounded-full text-xs', difficultyColor[tour.difficulty] || '')}>
                    {tour.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Group Size</span>
                  <span className="font-semibold">Up to {tour.maxGroupSize || 15}</span>
                </div>
              </div>

              <button
                onClick={handleBookTour}
                className="btn-primary w-full group"
              >
                Book This Tour
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
                <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-xs text-green-700 font-bold">Free cancellation up to 24h before</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
