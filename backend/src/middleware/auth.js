const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        // Get user from database (excluding password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "Access denied. User not found or inactive.",
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Access denied. Invalid token.",
        });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    } else {
        res.status(401).json({
            message: "Access denied. Admins privileges required.",
        });
    }
}

module.exports = {
    authenticate,
    requireAdmin,
};
