const ratingOptions = [4, 3, 2, 1];

const ProductFilters = ({ filters, onChange, categories }) => {
  const handlePriceChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-6 shadow-card">
      <div>
        <h3 className="font-display font-bold text-ink mb-3">🗂️ Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onChange({ ...filters, category: '' })}
              className="text-primary-600 w-4 h-4"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer font-medium">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="text-primary-600 w-4 h-4"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-ink mb-3">💰 Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full px-3 py-1.5 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-primary-400 outline-none"
          />
          <span className="text-gray-400 font-bold">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full px-3 py-1.5 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-primary-400 outline-none"
          />
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-ink mb-3">⭐ Minimum Rating</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => onChange({ ...filters, minRating: '' })}
              className="text-primary-600 w-4 h-4"
            />
            Any rating
          </label>
          {ratingOptions.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer font-medium">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === String(r)}
                onChange={() => onChange({ ...filters, minRating: String(r) })}
                className="text-primary-600 w-4 h-4"
              />
              <span className="text-flash-500">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span> &amp; up
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', minRating: '' })}
        className="text-sm text-deal-600 hover:text-deal-700 font-bold"
      >
        Clear all filters ✕
      </button>
    </div>
  );
};

export default ProductFilters;
