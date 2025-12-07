const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

exports.requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided. Please login.",
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token. Please login again.",
      });
    }

    // Get user from database (optional - for fresh data)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({
      message: "Authentication error.",
    });
  }
};

exports.requireGuest = (req, res, next) => {
  next();
};
