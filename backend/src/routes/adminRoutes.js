const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);

module.exports = router;
