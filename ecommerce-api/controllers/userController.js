const { User } = require("../models"); // Import the User model

// Get all users (Admin Only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');  // Assuming you're populating the role field
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,  // Assuming role is populated with role name
      })),
    });
  } catch (error) {
    console.error(error);
    // Ensure only one response is sent
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get all users By Roles (Admin Only)
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query;  // Retrieve the 'role' from query parameters

  try {
    // If role is not passed, return an error
    if (!role) {
      return res.status(400).json({ message: 'Role is required in the query parameter' });
    }

    // Find users based on the role string directly
    const users = await User.find({ role });

    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }

    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    console.error('Error in fetching users by role:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID (Admin or User itself)
exports.getUserById = async (req, res) => {
  try {
    console.log("Get By User Id : ", req.user.role);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user by ID (Admin can update any user, User can update their own)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: {
      id: updatedUser.id,
      name : updatedUser.username,
      email : updatedUser.email,
      password : updatedUser.password,
      role : updatedUser.role,
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
