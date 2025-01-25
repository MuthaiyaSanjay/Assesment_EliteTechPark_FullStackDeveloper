const { User } = require("../models"); // Import the User model
const logger = require('../utils/logger'); // Import the logger

// Get all users (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    logger.info('Fetching all users');  // Log when fetching all users
    const users = await User.find().populate('role');
    if (!users || users.length === 0) {
      logger.warn('No users found');
      return res.status(404).json({ message: "No users found" });
    }

    logger.info(`Fetched ${users.length} users`);
    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    logger.error('Error fetching users: ' + error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get all users By Roles (Admin Only)
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    if (!role) {
      logger.warn('Role parameter is missing');
      return res.status(400).json({ message: 'Role is required in the query parameter' });
    }

    logger.info(`Fetching users with role: ${role}`);
    const users = await User.find({ role });
    if (users.length === 0) {
      logger.warn(`No users found with role: ${role}`);
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }

    logger.info(`Fetched ${users.length} users with role: ${role}`);
    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    logger.error('Error in fetching users by role: ' + error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID (Admin or User itself)
exports.getUserById = async (req, res) => {
  try {
    logger.info(`Fetching user with ID: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn(`User with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User found: ${user.username}`);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error fetching user by ID: ' + error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user by ID (Admin can update any user, User can update their own)
exports.updateUser = async (req, res) => {
  try {
    logger.info(`Updating user with ID: ${req.params.id}`);
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      logger.warn(`User with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User with ID: ${req.params.id} updated successfully`);
    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        password: updatedUser.password,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    logger.error('Error updating user: ' + error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    logger.info(`Deleting user with ID: ${req.params.id}`);
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      logger.warn(`User with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User with ID: ${req.params.id} deleted successfully`);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error('Error deleting user: ' + error.message);
    res.status(500).json({ message: "Server error" });
  }
};
