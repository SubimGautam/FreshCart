const Product = require('../models/Product');
const Review = require('../models/Review');

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    const sortMap = {
      newest: '-createdAt',
      price_asc: 'price',
      price_desc: '-price',
      rating: '-averageRating',
      popularity: '-soldCount',
    };
    const sortBy = sortMap[sort] || '-createdAt';

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
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

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(8);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isBestSeller: true })
      .sort('-soldCount')
      .limit(8);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getDeals = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      discountPrice: { $ne: null, $gt: 0 },
    }).limit(8);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

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

const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    }).limit(6);

    res.status(200).json({ products: related });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

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

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Review.deleteMany({ product: product._id });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getDeals,
  getCategories,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
