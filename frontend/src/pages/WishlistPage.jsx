import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      await removeFromWishlist(product._id);
      toast.success(`${product.name} moved to cart 🛒`);
    } catch (err) {
      toast.error(err.message || 'Could not move item to cart');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">♡</div>
          <p className="text-gray-500 mb-6 font-medium">Your wishlist is empty.</p>
          <Link to="/dashboard" className="bg-deal-500 hover:bg-deal-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-pop active:translate-y-0.5 active:shadow-none inline-block">
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden flex flex-col">
              <Link to={`/products/${product._id}`} className="h-36 bg-gradient-to-br from-primary-50 to-cream flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🛒</span>
                )}
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/products/${product._id}`} className="font-display font-bold text-ink hover:text-primary-600">
                  {product.name}
                </Link>
                {product.numReviews > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={product.averageRating} size="text-xs" />
                    <span className="text-xs text-gray-400 font-medium">({product.numReviews})</span>
                  </div>
                )}
                <span className="text-lg font-display font-extrabold text-deal-600 mt-2">${product.price.toFixed(2)}</span>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white text-sm font-bold px-3 py-2 rounded-full transition"
                  >
                    {product.stock === 0 ? 'Out of stock' : 'Move to Cart'}
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="text-gray-400 hover:text-deal-500 px-2"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
