const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculate and persist a product's average rating and review count
const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating = numReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });
};

// @route   GET /api/products/:productId/reviews
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products/:productId/reviews   { rating, comment }
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product. You can edit your review instead.' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    await recalculateProductRating(productId);

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/reviews/:id   { rating, comment }
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own review' });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await recalculateProductRating(review.product);

    res.status(200).json({ message: 'Review updated', review });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();
    await recalculateProductRating(productId);

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reviews/admin/all (admin only)
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('product', 'name').sort('-createdAt');
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
};