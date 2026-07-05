const express = require('express');
const { updateReview, deleteReview, getAllReviews } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/admin/all', restrictTo('admin'), getAllReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
