import { Star } from 'lucide-react';

// Legacy `size` values (tailwind text-size classes) map to icon dimensions
// so every existing caller keeps working without changes.
const sizeMap = {
  'text-xs': 'w-3 h-3',
  'text-sm': 'w-3.5 h-3.5',
  'text-base': 'w-4 h-4',
  'text-2xl': 'w-6 h-6',
};

const StarRating = ({ rating = 0, size = 'text-base', interactive = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];
  const dim = sizeMap[size] || 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            tabIndex={interactive ? 0 : -1}
            onClick={() => interactive && onChange?.(star)}
            className={`${dim} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            aria-hidden={!interactive}
          >
            <Star
              className={`${dim} ${filled ? 'text-flash-500' : 'text-stone-300'}`}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
