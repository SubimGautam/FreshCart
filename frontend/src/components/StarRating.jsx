const StarRating = ({ rating = 0, size = 'text-base', interactive = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;