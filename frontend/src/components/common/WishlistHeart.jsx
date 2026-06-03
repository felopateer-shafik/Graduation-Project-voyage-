import { useNavigate } from 'react-router-dom';
import useWishlistStore from '@/store/useWishlistStore';
import useAuthStore from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/**
 * Reusable wishlist heart button.
 * Props:
 *   item  — the full item object (must have .id + any fields needed by the store)
 *   type  — 'hotel' | 'tour' | 'package' | 'flight'
 *   className — extra classes on the outer button (optional)
 */
export default function WishlistHeart({ item, type, className, iconClassName }) {
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const isSaved = isInWishlist(item?.id, type);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    toggleItem({ ...item, type });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/40 transition-colors',
        className
      )}
    >
      <span
        className={cn(
          'material-symbols-outlined text-base transition-colors',
          isSaved ? 'text-error' : iconClassName || 'text-white'
        )}
        style={{ fontVariationSettings: isSaved ? '"FILL" 1' : '"FILL" 0' }}
      >
        favorite
      </span>
    </button>
  );
}
