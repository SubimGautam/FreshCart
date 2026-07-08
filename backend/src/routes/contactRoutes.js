const express = require('express');
const { submitContactForm, getAllMessages } = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route – anyone can submit
router.post('/', submitContactForm);

// Admin only – view all messages (optional)
router.get('/admin', protect, restrictTo('admin'), getAllMessages);

module.exports = router;