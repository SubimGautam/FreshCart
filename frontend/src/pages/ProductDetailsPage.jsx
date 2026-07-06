import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getProductByIdRequest,
  getRelatedProductsRequest,
  getProductReviewsRequest,
  createReviewRequest,
  updateReviewRequest,
  deleteReviewRequest,
} from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productData, relatedData, reviewsData] = await Promise.all([
        getProductByIdRequest(id),
        getRelatedProductsRequest(id),
        getProductReviewsRequest(id),
      ]);
      setProduct(productData.product);
      setRelated(relatedData.products);
      setReviews(reviewsData.reviews);
      setActiveImage(0);
    } catch (err) {
      toast.error('Could not load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart 🛒`);
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist');
    }
  };

  const myReview = reviews.find((r) => r.user === user?._id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateReviewRequest(editingReviewId, reviewForm);
        toast.success('Review updated');
      } else {
        await createReviewRequest(product._id, reviewForm);
        toast.success('Review submitted');
      }
      setReviewForm({ rating: 5, comment: '' });
      setEditingReviewId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewRequest(reviewId);
      toast.success('Review deleted');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Could not delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-flash-400 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-3">😕</div>
        <p className="text-gray-500 font-medium">Product not found.</p>
        <Link to="/dashboard" className="text-deal-600 hover:underline mt-2 inline-block font-bold">
          Back to shop
        </Link>
      </div>
    );
  }

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const isOnSale = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = isOnSale ? product.discountPrice : product.price;
  const percentOff = isOnSale ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/dashboard" className="hover:text-primary-600">Shop</Link>
        <span className="mx-2">/</span>
        <Link to={`/dashboard?category=${product.category}`} className="hover:text-primary-600">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-bold">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="bg-gradient-to-br from-primary-50 to-cream rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden mb-4 relative border-2 border-gray-100">
            {isOnSale && (
              <span className="absolute top-4 left-4 bg-deal-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-full shadow-pop -rotate-3 z-10">
                -{percentOff}% OFF
              </span>
            )}
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🛒</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === idx ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs text-primary-600 font-bold uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl font-display font-extrabold text-ink mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.averageRating} />
            <span className="text-sm text-gray-500 font-medium">
              {product.averageRating?.toFixed(1) || '0.0'} ({product.numReviews || 0} review{product.numReviews === 1 ? '' : 's'})
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-4xl font-display font-extrabold text-deal-600">${displayPrice.toFixed(2)}</span>
            {isOnSale && (
              <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
            <span className="text-sm text-gray-400 font-medium">/ {product.unit}</span>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                ✓ In stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                Out of stock
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-bold"
              >
                −
              </button>
              <span className="px-4 py-2.5 font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-display font-bold py-3 rounded-full transition shadow-pop active:translate-y-0.5 active:shadow-none"
            >
              Add to Cart
            </button>

            {isAuthenticated && (
              <button
                onClick={handleWishlistToggle}
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition ${
                  isInWishlist(product._id)
                    ? 'border-deal-400 bg-deal-50 text-deal-500'
                    : 'border-gray-200 text-gray-400 hover:border-deal-300 hover:text-deal-500'
                }`}
                title="Add to wishlist"
              >
                <span className="text-xl">{isInWishlist(product._id) ? '♥' : '♡'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-display font-extrabold text-ink mb-6">💬 Customer Reviews</h2>

        {isAuthenticated && !myReview && !editingReviewId && (
          <form onSubmit={handleReviewSubmit} className="bg-primary-50 rounded-2xl p-5 mb-6 border-2 border-primary-100">
            <p className="font-display font-bold text-ink mb-2">Write a review</p>
            <StarRating
              rating={reviewForm.rating}
              size="text-2xl"
              interactive
              onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
            />
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              rows={3}
              className="w-full mt-3 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition resize-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="mt-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-full transition"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {editingReviewId && (
          <form onSubmit={handleReviewSubmit} className="bg-flash-300/30 rounded-2xl p-5 mb-6 border-2 border-flash-400">
            <p className="font-display font-bold text-ink mb-2">Edit your review</p>
            <StarRating
              rating={reviewForm.rating}
              size="text-2xl"
              interactive
              onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
            />
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows={3}
              className="w-full mt-3 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-full transition"
              >
                {submittingReview ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setEditingReviewId(null); setReviewForm({ rating: 5, comment: '' }); }}
                className="text-gray-500 hover:text-gray-700 px-5 py-2.5 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div key={review._id} className="border-b-2 border-gray-100 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-ink">{review.userName}</p>
                    <StarRating rating={review.rating} size="text-sm" />
                  </div>
                  {review.user === user?._id && editingReviewId !== review._id && (
                    <div className="flex gap-3 text-sm font-bold">
                      <button onClick={() => handleEditReview(review)} className="text-primary-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {review.comment && <p className="text-gray-600 mt-2">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-display font-extrabold text-ink mb-6">🛍️ You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} onAddToCart={(id) => addToCart(id, 1)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
