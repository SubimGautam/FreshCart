const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/wishlist  { productId }
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.some((id) => id.toString() === productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    await user.populate('wishlist');

    res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    await user.populate('wishlist');

    res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };