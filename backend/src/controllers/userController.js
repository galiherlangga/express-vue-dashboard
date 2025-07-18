const User = require("../models/User");
const { generateToken } = require("../config/jwt");

const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            role = "",
            isActive = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;
        
        const filter = {};
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        
        if (role) {
            filter.role = role;
        }
        
        if (isActive !== "") {
            filter.isActive = isActive === "true";
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        
        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        const totalUsers = await User
        const totalPages = Math.ceil(totalUsers / parseInt(limit));
        
        res.status(200).json({
            success:true,
            data: {
                users,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPreviousPage: parseInt(page) > 1,
                },
            }
        })
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, password, role = "user", isActive = true } = req.body;
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        
        // Create new user
        const user = new User({
            name,
            email,
            password,
            role,
            isActive,
        });
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password; // Exclude password from response
        
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message,
            );
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        // Check if email is being updated and already exists       
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) { 
                return res.status(400).json({
                    success: false,
                    message: "User with this email already exists",
                });
            }
        }
        
        // Update user
        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message,
            );
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deletion of the current user
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account",
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {
                deletedUser: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};