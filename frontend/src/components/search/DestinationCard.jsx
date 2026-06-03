import { cn } from '@/utils/cn';

/**
 * Destination card for the landing page bento grid
 * @param {{ name: string, country: string, image: string, price: string, tag?: string, className?: string }} props
 */
export default function DestinationCard({ name, country, image, price, tag, className = '' }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-3xl group cursor-pointer',
      className
    )}>
      <img
        src={image}
        alt={`${name}, ${country}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {tag && (
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          <span className="text-white text-xs font-bold">{tag}</span>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white font-headline font-bold text-lg leading-tight">{name}</h3>
        <p className="text-white/70 text-sm">{country}</p>
        {price && (
          <p className="text-white font-bold text-sm mt-1">
            From <span className="text-primary-container">{price}</span>
          </p>
        )}
      </div>
    </div>
  );
}
