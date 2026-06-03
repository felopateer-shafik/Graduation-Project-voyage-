import { useState, useEffect, useCallback } from 'react';
import { reviewsAPI } from '@/api/reviews';
import useAuthStore from '@/store/useAuthStore';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import toast from 'react-hot-toast';

function ReviewCard({ review, currentUserId, onDelete }) {
  const initials = (review.userFullName || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dateStr = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {review.userAvatarUrl ? (
            <img src={review.userAvatarUrl} alt={review.userFullName} className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0">
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-sm">{review.userFullName || 'Guest'}</p>
            <p className="text-[10px] text-outline">{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars value={review.rating} size="sm" />
          {currentUserId === review.userId && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-error/60 hover:text-error transition-colors ml-2"
              aria-label="Delete review"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          )}
        </div>
      </div>
      {review.title && (
        <p className="font-bold text-sm mb-1">{review.title}</p>
      )}
      <p className="text-sm text-on-surface-variant leading-relaxed">{review.body}</p>
    </div>
  );
}

/**
 * ReviewList — renders the full reviews section for a target.
 * Props:
 *   targetType — 'HOTEL' | 'TOUR' | 'PACKAGE'
 *   targetId   — number
 */
export default function ReviewList({ targetType, targetId }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await reviewsAPI.list(targetType, targetId);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await reviewsAPI.remove(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review deleted.');
    } catch {
      toast.error('Could not delete review.');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-xl font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
          Reviews
          {avgRating && (
            <span className="text-base font-bold text-on-surface-variant ml-1">
              {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
      </div>

      {/* Review form */}
      <ReviewForm
        targetType={targetType}
        targetId={targetId}
        onSubmitted={(r) => setReviews((prev) => [r, ...prev])}
      />

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-container/50 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant text-sm">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
