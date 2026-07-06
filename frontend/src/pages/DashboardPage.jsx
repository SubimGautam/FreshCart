import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, PackageSearch, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductsRequest, getCategoriesRequest } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ProductFilters from '../components/ProductFilters';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getProductsRequest({
        category: filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        minRating: filters.minRating || undefined,
        search: search || undefined,
        sort,
      });
      setProducts(data.products);
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getCategoriesRequest().then((data) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
    fetchProducts();
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleScrollForMore = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="bg-cream border-b border-stone-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-10">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Welcome back</span>
          <h1 className="text-3xl font-display font-semibold text-ink mt-1">Hey {user?.name?.split(' ')[0]}</h1>
          <p className="text-ink/55 mt-1">Let's find you some fresh groceries today.</p>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-ink/35 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-full focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none transition bg-white"
            />
          </form>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 border border-stone-200 rounded-full focus:ring-1 focus:ring-primary-400 outline-none transition bg-white text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="lg:hidden flex items-center justify-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-ink px-5 py-2.5 rounded-full font-medium transition"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} /> Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters filters={filters} onChange={setFilters} categories={categories} />
          </aside>

          <div ref={gridRef}>
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
                <PackageSearch className="w-12 h-12 mx-auto mb-3 text-stone-300" strokeWidth={1.25} />
                <p className="text-ink/50">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {products.length > 8 && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleScrollForMore}
                      className="w-11 h-11 rounded-full bg-white border border-stone-200 shadow-card flex items-center justify-center text-ink/50 hover:text-primary-600 hover:border-primary-300 transition animate-bounce"
                      title="Scroll for more products"
                      aria-label="Scroll for more products"
                    >
                      <ChevronDown className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
