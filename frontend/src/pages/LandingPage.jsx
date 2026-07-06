import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, Carrot, Milk, Wheat, Beef, Package, Truck, Leaf, CreditCard, PackageCheck, Tag, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getFeaturedProductsRequest, getBestSellersRequest, getDealsRequest } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const categories = [
  { name: 'Fruits', icon: Apple },
  { name: 'Vegetables', icon: Carrot },
  { name: 'Dairy', icon: Milk },
  { name: 'Bakery', icon: Wheat },
  { name: 'Meat', icon: Beef },
  { name: 'Pantry', icon: Package },
];

const features = [
  { icon: Truck, title: 'Fast delivery', description: 'As little as 30 minutes to your door.' },
  { icon: Leaf, title: 'Fresh produce', description: 'Hand-picked daily from local farms.' },
  { icon: CreditCard, title: 'Easy checkout', description: 'Secure payments, zero hassle.' },
  { icon: PackageCheck, title: 'Live tracking', description: 'Watch your order all the way home.' },
];

const reviews = [
  { name: 'Sarita K.', rating: 5, text: 'Always fresh, always on time. FreshCart has become part of my weekly routine.' },
  { name: 'Anil R.', rating: 5, text: 'Great prices and the app is so easy to use. The deals are unreal.' },
  { name: 'Priya M.', rating: 4, text: 'Love the variety of products. Delivery could be a touch faster but overall great.' },
];

const Eyebrow = ({ children }) => (
  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">{children}</span>
);

const SectionHeader = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between mb-6 border-b border-stone-200 pb-4">
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink mt-1">{title}</h2>
    </div>
    {action}
  </div>
);

const ProductSection = ({ eyebrow, title, products, loading, addToCart }) => {
  if (!loading && products.length === 0) return null;
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-12">
      <SectionHeader eyebrow={eyebrow} title={title} />
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
      {/* Hero */}
      <section className="bg-cream">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>Farm · to · door</Eyebrow>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-semibold text-ink leading-[1.08] mt-3">
              Fresh groceries,
              <br />
              delivered with care.
            </h1>
            <p className="mt-5 text-lg text-ink/60 max-w-md">
              Produce, pantry staples and everyday essentials — sourced thoughtfully and brought straight to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-full font-medium transition">
                  Start shopping <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-full font-medium transition">
                    Get started <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                  <Link to="/login" className="inline-flex items-center bg-white hover:bg-stone-100 text-ink px-7 py-3.5 rounded-full font-medium border border-stone-200 transition">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="bg-primary-100 rounded-2xl h-56 flex items-center justify-center">
              <Leaf className="w-14 h-14 text-primary-600" strokeWidth={1.25} />
            </div>
            <div className="bg-flash-300/60 rounded-2xl h-56 flex items-center justify-center mt-8">
              <Apple className="w-14 h-14 text-flash-600" strokeWidth={1.25} />
            </div>
            <div className="bg-deal-100 rounded-2xl h-40 flex items-center justify-center -mt-8">
              <Carrot className="w-12 h-12 text-deal-500" strokeWidth={1.25} />
            </div>
            <div className="bg-stone-100 rounded-2xl h-40 flex items-center justify-center">
              <Wheat className="w-12 h-12 text-ink/40" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-12">
        <SectionHeader eyebrow="Browse" title="Shop by category" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/dashboard?category=${cat.name}`}
              className="bg-white border border-stone-200 hover:border-primary-300 rounded-xl p-6 text-center transition-all hover:-translate-y-0.5 shadow-card"
            >
              <cat.icon className="w-7 h-7 mx-auto mb-2.5 text-primary-600" strokeWidth={1.5} />
              <div className="font-display font-medium text-ink text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection eyebrow="Curated" title="Featured products" products={featured} loading={loading} addToCart={addToCart} />
      <ProductSection eyebrow="Popular" title="Best sellers" products={bestSellers} loading={loading} addToCart={addToCart} />

      {/* Deals */}
      {(loading || deals.length > 0) && (
        <section className="bg-deal-50 border-y border-deal-100 py-12">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
            <div className="flex items-end justify-between mb-6 border-b border-deal-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-deal-600">
                  <Tag className="w-3.5 h-3.5" strokeWidth={2} /> Ends tonight
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink mt-1">Flash deals</h2>
              </div>
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
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
          <SectionHeader eyebrow="Why FreshCart" title="Grocery shopping, simplified" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-stone-200 shadow-card">
                <feature.icon className="w-7 h-7 text-primary-600 mb-3" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-ink mb-1">{feature.title}</h3>
                <p className="text-sm text-ink/55">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-primary-50/60 py-16 border-y border-stone-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
          <SectionHeader eyebrow="Reviews" title="What our customers say" />
          <div className="grid sm:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white rounded-xl p-6 border border-stone-200 shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill={i < review.rating ? '#C9A44C' : 'none'} stroke={i < review.rating ? '#C9A44C' : '#D3CDBD'} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="text-ink/65 text-sm mb-4 leading-relaxed">"{review.text}"</p>
                <p className="font-display font-semibold text-ink text-sm">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-semibold text-ink mb-4">Ready for fresh deals every day?</h2>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-full font-medium transition">
              Create your free account <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
