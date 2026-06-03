import { useState } from 'react';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';
import { reviewsAPI } from '@/api/reviews';
import useAuthStore from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';

/**
 * ReviewForm — inline form to submit a review.
 * Props:
 *   targetType  — 'HOTEL' | 'TOUR' | 'PACKAGE'
 *   targetId    — Long
 *   onSubmitted — callback(newReview) called after successful POST
 */
export default function ReviewForm({ targetType, targetId, onSubmitted }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-on-surface-variant text-sm mb-4">
          <button onClick={() => navigate(ROUTES.LOGIN)} className="font-bold text-primary hover:underline">Sign in</button>
          {' '}to leave a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating.'); return; }
    if (!body.trim()) { toast.error('Review body is required.'); return; }

    setSubmitting(true);
    try {
      const review = await reviewsAPI.create({ targetType, targetId, rating, title: title.trim() || null, body: body.trim() });
      toast.success('Review submitted!');
      setRating(0); setTitle(''); setBody('');
      onSubmitted?.(review);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not submit review. You may need a confirmed booking first.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
      <h4 className="font-headline font-bold text-base">Write a Review</h4>

      <div>
        <p className="text-xs text-on-surface-variant mb-2">Your rating</p>
        <RatingStars value={rating} onChange={setRating} />
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title (optional)"
          maxLength={200}
          className="input-field w-full text-sm"
        />
      </div>

      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience..."
          required
          rows={4}
          maxLength={2000}
          className="input-field w-full text-sm resize-none"
        />
        <p className="text-[10px] text-outline mt-1 text-right">{body.length}/2000</p>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : 'Submit Review'}
      </button>
    </form>
  );
}
