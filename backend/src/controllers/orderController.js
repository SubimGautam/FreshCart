const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const DELIVERY_FEE = 4.99;
const FREE_DELIVERY_THRESHOLD = 50;
const VALID_PAYMENT_METHODS = ['cash_on_delivery', 'esewa', 'mobile_banking'];

const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, fulfillmentMethod = 'delivery' } = req.body;

    if (!['delivery', 'pickup'].includes(fulfillmentMethod)) {
      return res.status(400).json({ message: 'Invalid fulfillment method' });
    }

    if (fulfillmentMethod === 'delivery') {
      if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode) {
        return res.status(400).json({ message: 'A complete shipping address is required' });
      }
    }

    if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const orderItems = [];
    let itemsTotal = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `A product in your cart is no longer available` });
      }
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} units of ${product.name} are available` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      });
      itemsTotal += product.price * cartItem.quantity;
    }

    const deliveryFee = fulfillmentMethod === 'pickup' || itemsTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = itemsTotal + deliveryFee;

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      fulfillmentMethod,
      shippingAddress: fulfillmentMethod === 'delivery' ? shippingAddress : undefined,
      itemsTotal,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || 'cash_on_delivery',
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
