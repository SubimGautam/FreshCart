const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }),
      Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
