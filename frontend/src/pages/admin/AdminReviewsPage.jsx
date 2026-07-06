import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from '../../components/StarRating';
import { getAllReviewsRequest, adminDeleteReviewRequest } from '../../services/adminService';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewsRequest();
      setReviews(data.reviews);
    } catch (err) {
      toast.error('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminDeleteReviewRequest(id);
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.message || 'Could not delete review');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">⭐ Manage Reviews</h1>

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No reviews yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <div key={review._id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-ink">{review.userName}</span>
                    <span className="text-gray-400 text-sm">on</span>
                    <span className="font-medium text-primary-600 text-sm">{review.product?.name || 'Unknown product'}</span>
                  </div>
                  <StarRating rating={review.rating} size="text-sm" />
                  {review.comment && <p className="text-gray-600 text-sm mt-1">{review.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-500 hover:underline font-bold text-sm flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
