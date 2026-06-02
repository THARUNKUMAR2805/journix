import { Star } from 'lucide-react';

interface Props {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({ rating, count, size = 'sm', showCount = true }: Props) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-200'}`}
          />
        ))}
      </div>
      <span className={`font-semibold text-gray-800 ${textSizes[size]}`}>{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className={`text-gray-500 ${textSizes[size]}`}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}
