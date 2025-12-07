const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

/**
 * POST /api/users/register
 * Register a new user and return JWT token
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;

    // Validation
    if (!username || !email || !password || !password2) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (password !== password2) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Create new user (password will be hashed by model pre-save hook)
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    // Return success with token and user info (no password)
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating account. Please try again.",
    });
  }
};

/**
 * POST /api/users/login
 * Login user and return JWT token
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("logging in - server-side");
    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Find user
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success with token and user info
    console.log("sending json response");
    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    console.log("json response sent");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Error logging in. Please try again.",
    });
  }
};

/**
 * POST /api/users/logout
 * Logout user (in JWT, just tells client to delete token)
 */
exports.logout = (req, res) => {
  // With JWT, logout is client-side (delete token from localStorage)
  // We just send a success response
  res.json({
    success: true,
    message: "Logout successful",
  });
};

/**
 * GET /api/users/profile
 * Get current user profile (requires auth)
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by requireAuth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

/**
 * PUT /api/users/profile
 * Update user profile (requires auth)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.body;

    // Only allow updating email for now
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email: email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

/**
 * PUT /api/users/profile
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email: email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

/**
 * PUT /api/users/password
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};