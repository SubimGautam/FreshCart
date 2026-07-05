const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/admin/all', restrictTo('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);

module.exports = router;