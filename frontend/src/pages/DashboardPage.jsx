import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-flash-400 rounded-full opacity-20 blur-xl" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <h1 className="text-3xl font-display font-extrabold text-white">Hey {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-primary-50 font-medium mt-1">Let's find you some fresh deals today.</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition font-medium"
            />
            <button
              type="submit"
              className="bg-deal-500 hover:bg-deal-600 text-white px-6 py-2.5 rounded-full font-bold transition shadow-pop active:translate-y-0.5 active:shadow-none"
            >
              Search
            </button>
          </form>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-400 outline-none transition bg-white font-medium"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="lg:hidden bg-ink hover:bg-ink/90 text-white px-5 py-2.5 rounded-full font-bold transition"
          >
            Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters filters={filters} onChange={setFilters} categories={categories} />
          </aside>

          <div>
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-gray-500 font-medium">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
