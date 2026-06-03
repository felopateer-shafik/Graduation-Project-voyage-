import { cn } from '@/utils/cn';

/**
 * RatingStars — display or interactive 1-5 star rating.
 * Props:
 *   value    — current rating (number)
 *   onChange — if provided, renders as interactive input
 *   size     — 'sm' | 'md' (default 'md')
 */
export default function RatingStars({ value, onChange, size = 'md' }) {
  const iconSize = size === 'sm' ? 'text-base' : 'text-2xl';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={onChange ? () => onChange(star) : undefined}
          disabled={!onChange}
          className={cn(
            'transition-transform',
            onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          )}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <span
            className={cn(
              'material-symbols-outlined',
              iconSize,
              star <= value ? 'text-amber-400' : 'text-outline/30'
            )}
            style={{ fontVariationSettings: star <= value ? '"FILL" 1' : '"FILL" 0' }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}
