const express = require('express');
const {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getDeals,
  getCategories,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/deals', getDeals);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:productId/reviews', getProductReviews);

router.post('/:productId/reviews', protect, createReview);

router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
