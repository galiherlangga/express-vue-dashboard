const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name must be at most 50 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: "Please enter a valid email address",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 8 characters long"],
            select: false, // Exclude password from queries by default
        },
        role: {
            type: String,
            enum: {
                values: ["user", "admin"],
                message: "Role must be either user or admin",
            },
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const duplicateError = new Error("Email already exists");
        duplicateError.name = "ValidationError";
        return next(duplicateError);
    } else {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (rawPassword) {
    if (!rawPassword) {
        return false;
    }
    try {
        return await bcrypt.compare(rawPassword, this.password);
    } catch (error) {
        throw new Error("Password comparison failed");
    }
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
