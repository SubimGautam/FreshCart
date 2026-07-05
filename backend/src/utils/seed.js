require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Review = require('../models/Review');
const Order = require('../models/Order');

const sampleCategories = [
  { name: 'Fruits', icon: '🍎' },
  { name: 'Vegetables', icon: '🥕' },
  { name: 'Dairy', icon: '🥛' },
  { name: 'Bakery', icon: '🍞' },
  { name: 'Meat', icon: '🍗' },
  { name: 'Pantry', icon: '🌾' },
];

const sampleProducts = [
  { name: 'Fresh Bananas', category: 'Fruits', price: 1.49, unit: '1 kg', stock: 120, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', description: 'Sweet, ripe bananas sourced fresh daily from local farms. Great source of potassium and natural energy.', isFeatured: true, soldCount: 340 },
  { name: 'Red Apples', category: 'Fruits', price: 2.99, discountPrice: 2.49, unit: '1 kg', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600', description: 'Crisp and juicy red apples, perfect for snacking or baking.', isBestSeller: true, soldCount: 410 },
  { name: 'Organic Spinach', category: 'Vegetables', price: 1.99, unit: '250 g', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600', description: 'Locally grown organic spinach leaves, rich in iron and vitamins.', isFeatured: true, soldCount: 150 },
  { name: 'Carrots', category: 'Vegetables', price: 1.29, unit: '1 kg', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600', description: 'Fresh and crunchy carrots, great for cooking or juicing.', soldCount: 200 },
  { name: 'Whole Milk', category: 'Dairy', price: 2.49, unit: '1 L', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', description: 'Farm-fresh whole milk, pasteurized and rich in calcium.', isBestSeller: true, soldCount: 380 },
  { name: 'Free-Range Eggs', category: 'Dairy', price: 3.99, discountPrice: 3.49, unit: '12 pack', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600', description: 'Free-range eggs from happy hens, a great source of protein.', isFeatured: true, soldCount: 290 },
  { name: 'Whole Wheat Bread', category: 'Bakery', price: 2.79, unit: '500 g', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=600', description: 'Freshly baked whole wheat bread, soft and wholesome.', soldCount: 175 },
  { name: 'Chicken Breast', category: 'Meat', price: 6.99, unit: '1 kg', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600', description: 'Boneless, skinless chicken breast, lean and high in protein.', isBestSeller: true, soldCount: 260 },
  { name: 'Basmati Rice', category: 'Pantry', price: 8.49, unit: '5 kg', stock: 35, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', description: 'Premium long-grain basmati rice, aromatic and fluffy.', soldCount: 130 },
  { name: 'Olive Oil', category: 'Pantry', price: 9.99, discountPrice: 7.99, unit: '1 L', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', description: 'Extra virgin olive oil, cold-pressed for rich flavor.', isFeatured: true, soldCount: 220 },
];

const seed = async () => {
  try {
    await connectDB();

    await Category.deleteMany({});
    await Category.insertMany(sampleCategories);
    console.log(`Seeded ${sampleCategories.length} categories.`);

    await Review.deleteMany({});
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products.`);

    let adminUser = await User.findOne({ email: 'admin@freshcart.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'FreshCart Admin',
        email: 'admin@freshcart.com',
        password: 'Admin12345',
        role: 'admin',
      });
      console.log('Seeded admin user: admin@freshcart.com / Admin12345');
    }

    let demoUser = await User.findOne({ email: 'demo@freshcart.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Customer',
        email: 'demo@freshcart.com',
        password: 'Demo12345',
        role: 'customer',
      });
      console.log('Seeded demo customer: demo@freshcart.com / Demo12345');
    }

    const sampleReviews = [
      { product: createdProducts[0]._id, user: demoUser._id, userName: demoUser.name, rating: 5, comment: 'Always fresh and sweet, my kids love them!' },
      { product: createdProducts[1]._id, user: demoUser._id, userName: demoUser.name, rating: 4, comment: 'Good quality apples, slightly pricey but worth it.' },
    ];
    await Review.insertMany(sampleReviews);

    for (const review of sampleReviews) {
      const reviews = await Review.find({ product: review.product });
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(review.product, {
        averageRating: Math.round(avg * 10) / 10,
        numReviews: reviews.length,
      });
    }
    console.log('Seeded sample reviews.');

    await Order.deleteMany({});
    const sampleOrders = [
      {
        user: demoUser._id,
        items: [
          { product: createdProducts[0]._id, name: createdProducts[0].name, price: createdProducts[0].price, quantity: 3 },
          { product: createdProducts[4]._id, name: createdProducts[4].name, price: createdProducts[4].price, quantity: 2 },
        ],
        shippingAddress: { line1: '123 Demo Street', city: 'Kathmandu', postalCode: '44600', country: 'Nepal' },
        itemsTotal: createdProducts[0].price * 3 + createdProducts[4].price * 2,
        deliveryFee: 0,
        totalAmount: createdProducts[0].price * 3 + createdProducts[4].price * 2,
        status: 'delivered',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'paid',
      },
      {
        user: demoUser._id,
        items: [
          { product: createdProducts[7]._id, name: createdProducts[7].name, price: createdProducts[7].price, quantity: 1 },
        ],
        shippingAddress: { line1: '123 Demo Street', city: 'Kathmandu', postalCode: '44600', country: 'Nepal' },
        itemsTotal: createdProducts[7].price,
        deliveryFee: 4.99,
        totalAmount: createdProducts[7].price + 4.99,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
      },
    ];
    await Order.insertMany(sampleOrders);
    console.log(`Seeded ${sampleOrders.length} sample orders.`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
