import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart, Tag, TrendingUp, Sparkles, ShoppingBag } from 'lucide-react';
import StarRating from './StarRating';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isOnSale = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = isOnSale ? product.discountPrice : product.price;
  const percentOff = isOnSale ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await onAddToCart(product._id);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist');
    }
  };

  const badge = isOnSale
    ? { label: `−${percentOff}%`, icon: Tag, cls: 'bg-deal-600 text-white' }
    : product.isBestSeller
    ? { label: 'Best seller', icon: TrendingUp, cls: 'bg-ink text-white' }
    : product.isFeatured
    ? { label: 'Featured', icon: Sparkles, cls: 'bg-primary-700 text-white' }
    : null;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-xl border border-stone-200 hover:border-primary-300 shadow-card hover:shadow-pop transition-all overflow-hidden flex flex-col relative group"
    >
      {badge && (
        <span className={`absolute top-3 left-3 ${badge.cls} text-[11px] font-semibold px-2.5 py-1 rounded-full z-10 flex items-center gap-1`}>
          <badge.icon className="w-3 h-3" strokeWidth={2} />
          {badge.label}
        </span>
      )}

      {isAuthenticated && (
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition border ${
            isInWishlist(product._id)
              ? 'bg-deal-500 border-deal-500 text-white'
              : 'bg-white/90 border-stone-200 text-ink/50 hover:text-deal-500'
          }`}
        >
          <Heart className="w-[18px] h-[18px]" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} strokeWidth={1.75} />
        </button>
      )}

      <div className="h-56 bg-stone-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ShoppingBag className="w-12 h-12 text-stone-300" strokeWidth={1.5} />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] text-primary-600 font-semibold uppercase tracking-wide">{product.category}</span>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={product.averageRating} size="text-xs" />
            <span className="text-xs text-ink/40">({product.numReviews})</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mt-1.5">
          <h3 className="font-display font-semibold text-ink leading-snug">{product.name}</h3>
          <div className="text-right flex-shrink-0">
            <div className="font-display font-semibold text-lg text-ink tabular whitespace-nowrap">
              ${displayPrice.toFixed(2)}
            </div>
            {isOnSale && (
              <div className="text-xs text-ink/35 line-through">${product.price.toFixed(2)}</div>
            )}
          </div>
        </div>

        <p className="text-sm text-ink/50 mt-1 flex-1 line-clamp-2">{product.description}</p>
        <div className="text-[11px] text-ink/40 mt-1">per {product.unit}</div>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-stone-200 disabled:text-ink/30 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-full transition"
        >
          {product.stock === 0 ? 'Sold out' : `Add to cart – $${displayPrice.toFixed(2)}`}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
