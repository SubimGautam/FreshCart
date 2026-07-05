const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @route   POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.cookie('token', token, cookieOptions);
    res.status(201).json({
      message: 'Account created successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // explicitly select password since schema excludes it by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, cookieOptions);
    res.status(200).json({
      message: 'Logged in successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: 'Logged out successfully' });
};

// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, getMe };