const Product = require('../models/Product');

// @route   GET /api/products
// Supports query params: search, category, page, limit, sort
const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalResults: total,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products (admin only)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};