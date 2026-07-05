const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatarUrl } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    res.status(200).json({ addresses: req.user.addresses });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({ message: 'Address updated', addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.status(200).json({ message: 'Address deleted', addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be customer or admin' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    next(error);
  }
};

const toggleBlockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked, isActive: !isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: isBlocked ? 'User blocked' : 'User unblocked', user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
