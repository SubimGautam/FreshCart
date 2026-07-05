const express = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.get('/admin/all', restrictTo('admin'), getAllUsers);
router.put('/admin/:id/role', restrictTo('admin'), updateUserRole);
router.put('/admin/:id/block', restrictTo('admin'), toggleBlockUser);
router.delete('/admin/:id', restrictTo('admin'), deleteUser);

module.exports = router;
