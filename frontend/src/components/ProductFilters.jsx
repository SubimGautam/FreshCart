import { Tag, Wallet, Star, X } from 'lucide-react';

const ratingOptions = [4, 3, 2, 1];

const ProductFilters = ({ filters, onChange, categories }) => {
  const handlePriceChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-8 shadow-card">
      <div>
        <h3 className="flex items-center gap-2 font-display font-semibold text-lg text-ink mb-4">
          <Tag className="w-5 h-5 text-primary-600" strokeWidth={1.75} /> Category
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[15px] cursor-pointer text-ink/70">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onChange({ ...filters, category: '' })}
              className="w-[18px] h-[18px] accent-primary-600"
            />
            All categories
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 text-[15px] cursor-pointer text-ink/70">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="w-[18px] h-[18px] accent-primary-600"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-100 pt-6">
        <h3 className="flex items-center gap-2 font-display font-semibold text-lg text-ink mb-4">
          <Wallet className="w-5 h-5 text-primary-600" strokeWidth={1.75} /> Price range
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-[15px] focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
          />
          <span className="text-ink/30">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-[15px] focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none"
          />
        </div>
      </div>

      <div className="border-t border-stone-100 pt-6">
        <h3 className="flex items-center gap-2 font-display font-semibold text-lg text-ink mb-4">
          <Star className="w-5 h-5 text-primary-600" strokeWidth={1.75} /> Minimum rating
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[15px] cursor-pointer text-ink/70">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => onChange({ ...filters, minRating: '' })}
              className="w-[18px] h-[18px] accent-primary-600"
            />
            Any rating
          </label>
          {ratingOptions.map((r) => (
            <label key={r} className="flex items-center gap-3 text-[15px] cursor-pointer text-ink/70">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === String(r)}
                onChange={() => onChange({ ...filters, minRating: String(r) })}
                className="w-[18px] h-[18px] accent-primary-600"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < r ? '#C9A44C' : 'none'}
                    stroke={i < r ? '#C9A44C' : '#D3CDBD'}
                    strokeWidth={1.5}
                  />
                ))}
              </span>
              &amp; up
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', minRating: '' })}
        className="flex items-center gap-2 text-[15px] text-deal-600 hover:text-deal-700 font-medium border-t border-stone-100 pt-5 w-full"
      >
        <X className="w-4 h-4" strokeWidth={2} /> Clear all filters
      </button>
    </div>
  );
};

export default ProductFilters;
