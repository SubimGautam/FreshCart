const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cart  { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} units of ${product.name} are available` });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');

    res.status(200).json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((item) => item.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter((item) => item.product.toString() !== productId);

    await user.save();
    await user.populate('cart.product');

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };