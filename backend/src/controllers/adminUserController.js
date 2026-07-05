const User = require('../models/User');

// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/users/:id/role   { role }
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either customer or admin' });
    }

    if (req.params.id === req.user._id.toString() && role === 'customer') {
      return res.status(400).json({ message: 'You cannot demote yourself' });
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

// @route   PUT /api/admin/users/:id/block   { isBlocked }
const toggleBlockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked, isActive: !isBlocked },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: isBlocked ? 'User blocked' : 'User unblocked', user });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/users/:id
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

module.exports = { getAllUsers, updateUserRole, toggleBlockUser, deleteUser };
