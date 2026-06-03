import { cn } from '@/utils/cn';

/**
 * Universal loading skeleton with multiple variants
 * @param {{ className?: string, count?: number, variant?: string }} props
 */
export default function LoadingSkeleton({ className = '', count = 1, variant = 'text' }) {
  const variants = {
    text: 'h-4 rounded-lg',
    card: 'h-48 rounded-3xl',
    circle: 'h-12 w-12 rounded-full',
    avatar: 'h-16 w-16 rounded-2xl',
    button: 'h-10 w-32 rounded-full',
    title: 'h-8 w-64 rounded-xl',
    paragraph: 'h-4 w-full rounded-lg',
    image: 'h-64 rounded-3xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-surface-container animate-pulse',
            variants[variant] || variants.text,
            className
          )}
        />
      ))}
    </>
  );
}

/**
 * Flight card skeleton for search results pages
 */
export function FlightCardSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card-subtle rounded-[2rem] p-6 animate-pulse">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-surface-container" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-surface-container rounded-lg" />
                <div className="h-4 w-56 bg-surface-container/60 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="space-y-1 text-center">
                <div className="h-5 w-12 bg-surface-container rounded-lg mx-auto" />
                <div className="h-3 w-8 bg-surface-container/40 rounded" />
              </div>
              <div className="h-px w-16 bg-surface-container" />
              <div className="space-y-1 text-center">
                <div className="h-5 w-12 bg-surface-container rounded-lg mx-auto" />
                <div className="h-3 w-8 bg-surface-container/40 rounded" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-6 w-24 bg-surface-container rounded-lg ml-auto" />
              <div className="h-3 w-16 bg-surface-container/40 rounded-lg ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Hotel card skeleton for hotel list pages
 */
export function HotelCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card-subtle rounded-[2rem] p-6 animate-pulse">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-40 rounded-2xl bg-surface-container shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-surface-container rounded-lg" />
              <div className="h-4 w-32 bg-surface-container/60 rounded-lg" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-surface-container/40 rounded-full" />
                <div className="h-6 w-16 bg-surface-container/40 rounded-full" />
                <div className="h-6 w-16 bg-surface-container/40 rounded-full" />
              </div>
              <div className="flex justify-between items-end pt-4">
                <div className="h-4 w-24 bg-surface-container/60 rounded-lg" />
                <div className="h-8 w-28 bg-surface-container rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Tour card skeleton for tour grid
 */
export function TourCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card-subtle rounded-[2rem] overflow-hidden animate-pulse">
          <div className="h-48 bg-surface-container" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-surface-container rounded-lg" />
            <div className="h-4 w-1/2 bg-surface-container/60 rounded-lg" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-20 bg-surface-container/40 rounded-lg" />
              <div className="h-6 w-24 bg-surface-container rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Profile page skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-surface-container" />
        <div className="space-y-3">
          <div className="h-8 w-48 bg-surface-container rounded-xl" />
          <div className="h-4 w-36 bg-surface-container/60 rounded-lg" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card-subtle rounded-2xl p-6 space-y-2">
            <div className="h-8 w-16 bg-surface-container rounded-lg" />
            <div className="h-4 w-24 bg-surface-container/60 rounded-lg" />
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="glass-card-subtle rounded-[2rem] p-8 space-y-4">
        <div className="h-6 w-40 bg-surface-container rounded-lg" />
        <div className="h-4 w-full bg-surface-container/40 rounded-lg" />
        <div className="h-4 w-3/4 bg-surface-container/40 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Detail page skeleton (flight or hotel detail)
 */
export function DetailPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="h-72 rounded-[2rem] bg-surface-container" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-64 bg-surface-container rounded-xl" />
          <div className="h-4 w-full bg-surface-container/60 rounded-lg" />
          <div className="h-4 w-3/4 bg-surface-container/40 rounded-lg" />
          <div className="h-4 w-1/2 bg-surface-container/40 rounded-lg" />
        </div>
        <div className="glass-card-subtle rounded-[2rem] p-6 space-y-4 h-fit">
          <div className="h-8 w-32 bg-surface-container rounded-lg" />
          <div className="h-10 w-full bg-surface-container rounded-xl" />
        </div>
      </div>
    </div>
  );
}
