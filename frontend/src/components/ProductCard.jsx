import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      toast.success(`${product.name} added to cart 🛒`);
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist');
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-300 shadow-card hover:shadow-lg transition-all overflow-hidden flex flex-col relative group hover:-translate-y-0.5"
    >
      {isOnSale && (
        <span className="absolute top-2.5 left-2.5 bg-deal-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full z-10 shadow-pop -rotate-3">
          -{percentOff}%
        </span>
      )}
      {!isOnSale && product.isBestSeller && (
        <span className="absolute top-2.5 left-2.5 bg-flash-500 text-ink text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 shadow-pop -rotate-3">
          🔥 BEST SELLER
        </span>
      )}
      {!isOnSale && !product.isBestSeller && product.isFeatured && (
        <span className="absolute top-2.5 left-2.5 bg-primary-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 shadow-pop -rotate-3">
          ✨ FEATURED
        </span>
      )}

      {isAuthenticated && (
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center text-lg z-10 transition shadow-pop ${
            isInWishlist(product._id) ? 'bg-deal-500 text-white' : 'bg-white text-gray-400 hover:text-deal-500'
          }`}
        >
          {isInWishlist(product._id) ? '♥' : '♡'}
        </button>
      )}

      <div className="h-36 bg-gradient-to-br from-primary-50 to-cream flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <span className="text-4xl">🛒</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] text-primary-600 font-bold uppercase tracking-wide">{product.category}</span>
        <h3 className="font-display font-bold text-ink mt-0.5 leading-snug">{product.name}</h3>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={product.averageRating} size="text-xs" />
            <span className="text-xs text-gray-400 font-medium">({product.numReviews})</span>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-display font-extrabold text-deal-600">${displayPrice.toFixed(2)}</span>
            {isOnSale && (
              <span className="text-xs text-gray-400 line-through ml-1.5">${product.price.toFixed(2)}</span>
            )}
            <div className="text-[11px] text-gray-400 font-medium">/ {product.unit}</div>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2 rounded-full transition shadow-pop active:translate-y-0.5 active:shadow-none"
          >
            {product.stock === 0 ? 'Sold Out' : '+ Add'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
