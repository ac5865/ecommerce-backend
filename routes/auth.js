const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password (Note: In production, use bcrypt.compare())
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Login successful - return user data without password
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token: `mock-token-${user.userId}-${Date.now()}`, // Mock token
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET /api/auth/user/:userId - Get user by ID
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user data without password
    const userResponse = user.toJSON();

    res.json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// POST /api/auth/update-profile - Update user profile
router.post("/update-profile", async (req, res) => {
  try {
    const { userId, name, password, profileImage } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Find user
    const user = await User.findOne({ userId: parseInt(userId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only provided fields
    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password; // Note: In production, hash with bcrypt
    }

    if (profileImage !== undefined) {
      // profileImage can be base64 string or null to remove image
      user.profileImage = profileImage;
    }

    await user.save();

    // Return updated user without password
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
