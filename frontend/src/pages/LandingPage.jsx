import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getFeaturedProductsRequest, getBestSellersRequest, getDealsRequest } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const categories = [
  { name: 'Fruits', emoji: '🍎', color: 'bg-deal-100' },
  { name: 'Vegetables', emoji: '🥕', color: 'bg-primary-100' },
  { name: 'Dairy', emoji: '🥛', color: 'bg-flash-300' },
  { name: 'Bakery', emoji: '🍞', color: 'bg-orange-100' },
  { name: 'Meat', emoji: '🍗', color: 'bg-red-100' },
  { name: 'Pantry', emoji: '🌾', color: 'bg-yellow-100' },
];

const features = [
  { icon: '🚚', title: 'Fast Delivery', description: 'As little as 30 minutes to your door.' },
  { icon: '🥦', title: 'Fresh Produce', description: 'Hand-picked daily from local farms.' },
  { icon: '💳', title: 'Easy Checkout', description: 'Secure payments, zero hassle.' },
  { icon: '📦', title: 'Live Tracking', description: 'Watch your order all the way home.' },
];

const reviews = [
  { name: 'Sarita K.', rating: 5, text: 'Always fresh, always on time. FreshCart has become part of my weekly routine!' },
  { name: 'Anil R.', rating: 5, text: 'Great prices and the app is so easy to use. The deals are unreal!' },
  { name: 'Priya M.', rating: 4, text: 'Love the variety of products. Delivery could be a touch faster but overall great.' },
];

const SectionHeader = ({ emoji, title, subtitle, accent = 'text-deal-500' }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-3xl font-display font-extrabold text-ink flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      {subtitle && <p className={`font-bold ${accent} mt-1`}>{subtitle}</p>}
    </div>
  </div>
);

const ProductSection = ({ emoji, title, subtitle, accent, products, loading, addToCart }) => {
  if (!loading && products.length === 0) return null;
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader emoji={emoji} title={title} subtitle={subtitle} accent={accent} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p) => <ProductCard key={p._id} product={p} onAddToCart={(id) => addToCart(id, 1)} />)}
      </div>
    </section>
  );
};

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProductsRequest(), getBestSellersRequest(), getDealsRequest()])
      .then(([f, b, d]) => {
        setFeatured(f.products);
        setBestSellers(b.products);
        setDeals(d.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero with diagonal color block */}
      <section className="relative overflow-hidden bg-primary-600">
        <div
          className="absolute inset-0 bg-deal-500"
          style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 30% 100%)' }}
        />
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-flash-400 rounded-full opacity-30 blur-2xl" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-flash-400 text-ink font-extrabold text-sm px-4 py-1.5 rounded-full mb-4 -rotate-2 shadow-pop">
              🔥 UP TO 30% OFF — TODAY ONLY
            </span>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-white leading-[1.05]">
              Fresh deals,<br />
              <span className="text-flash-400">delivered fast.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-50 max-w-md font-medium">
              Groceries, snacks &amp; pantry staples — straight from the farm to your door, at prices that'll make you smile.
            </p>
            <div className="mt-8 flex gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-flash-400 hover:bg-flash-500 text-ink px-8 py-3.5 rounded-full font-extrabold text-lg transition shadow-pop active:translate-y-0.5 active:shadow-none">
                  Start Shopping →
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="bg-flash-400 hover:bg-flash-500 text-ink px-8 py-3.5 rounded-full font-extrabold text-lg transition shadow-pop active:translate-y-0.5 active:shadow-none">
                    Get Started →
                  </Link>
                  <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold text-lg border-2 border-white/40 transition">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="text-[160px] leading-none drop-shadow-2xl">🛒</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader emoji="🗂️" title="Shop by Category" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/dashboard?category=${cat.name}`}
              className={`${cat.color} rounded-2xl p-6 text-center shadow-card hover:shadow-lg hover:-translate-y-1 transition-all border-2 border-transparent hover:border-primary-300`}
              style={{ transform: `rotate(${i % 2 === 0 ? '-1' : '1'}deg)` }}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-display font-bold text-ink">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection emoji="✨" title="Featured Products" subtitle="Hand-picked for you" accent="text-primary-600" products={featured} loading={loading} addToCart={addToCart} />
      <ProductSection emoji="🔥" title="Best Sellers" subtitle="Everyone's buying these" accent="text-flash-600" products={bestSellers} loading={loading} addToCart={addToCart} />

      {/* Deals section gets a special bold treatment */}
      {(loading || deals.length > 0) && (
        <section className="bg-deal-500 py-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-3xl font-display font-extrabold text-white flex items-center gap-2">
                💸 Flash Deals
              </h2>
              <span className="bg-ink text-flash-400 font-bold text-sm px-4 py-1.5 rounded-full">
                Ends Tonight!
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : deals.map((p) => <ProductCard key={p._id} product={p} onAddToCart={(id) => addToCart(id, 1)} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader emoji="⭐" title="Why FreshCart?" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className={`bg-white rounded-2xl p-6 shadow-card text-center border-2 border-gray-50 hover:border-primary-200 transition`} style={{ transform: `rotate(${i % 2 === 0 ? '-0.5' : '0.5'}deg)` }}>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-display font-bold text-ink mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader emoji="💬" title="What Our Customers Say" accent="text-primary-600" />
          <div className="grid sm:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-card border-2 border-gray-50">
                <div className="text-flash-500 mb-2 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="text-gray-600 text-sm mb-3">"{review.text}"</p>
                <p className="font-display font-bold text-ink text-sm">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16 bg-ink">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-extrabold text-white mb-4">Ready for fresh deals every day?</h2>
            <Link to="/signup" className="inline-block bg-flash-400 hover:bg-flash-500 text-ink px-8 py-3.5 rounded-full font-extrabold text-lg transition shadow-pop active:translate-y-0.5 active:shadow-none">
              Create your free account →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
