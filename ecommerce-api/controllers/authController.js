const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later.",
    });
  }
};

// User signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Prevent creating restricted roles directly
    const restrictedRoles = ["admin", "super-admin", "staff"];
    if (restrictedRoles.includes(role)) {
      if (!req.user || req.user.role !== "super-admin") {
        return res.status(403).json({
          status: "error",
          message: `Access denied: You are not authorized to create a ${role} user.`,
        });
      }
    }

    // Validate the role from the Role model
    const userRole = await Role.findOne({ name: role });
    if (!userRole) {
      return res.status(400).json({
        status: "error",
        message: `Invalid role: ${role}`,
      });
    }

    // Check if a super-admin already exists
    if (role === "super-admin") {
      const existingSuperAdmin = await User.findOne({ role: "super-admin" });
      if (existingSuperAdmin) {
        return res.status(400).json({
          status: "error",
          message: "A super-admin already exists.",
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole.name,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: `${role} registered successfully`,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: userRole.name,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateField];

      return res.status(400).json({
        status: "error",
        message: `Duplicate value: The ${duplicateField} '${duplicateValue}' is already in use.`,
      });
    }

    console.error("Error in signup:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later.",
    });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      status: "success",
      message: "Token is valid",
      user: decoded,
    });
  } catch (error) {
    console.error("Error in token verification:", error.message);
    res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;
    console.log(`Email: ${email}`); // Logging the email for debugging purposes

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Validate the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changing password:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later.",
    });
  }
};

// Create Staff (Only accessible by Admin)
exports.createStaff = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only admin can create staff users",
      });
    }

    const { username, email, password, role } = req.body;

    // Validate that the role is 'staff' for creating a staff member
    if (role !== "staff") {
      return res.status(400).json({
        status: "error",
        message: "Role must be 'staff' to create a staff member",
      });
    }

    // Check if the staff user already exists
    const existingStaff = await User.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        status: "error",
        message: "Staff user with this email already exists",
      });
    }

    // Validate the staff role exists in the database
    const staffRole = await Role.findOne({ name: "staff" });
    if (!staffRole) {
      return res.status(400).json({
        status: "error",
        message: "Staff role does not exist",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new staff user
    const newStaff = new User({
      username,
      email,
      password: hashedPassword,
      role: staffRole.name, 
    });

    // Save the staff user
    await newStaff.save();

    res.status(201).json({
      status: "success",
      message: "Staff user created successfully",
      user: {
        id: newStaff._id,
        username: newStaff.username,
        email: newStaff.email,
        role: staffRole.name,
      },
    });
  } catch (error) {
    console.error("Error in creating staff:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later.",
    });
  }
};
