const mongoose = require("mongoose");
const User = require("../../src/models/User")

describe("User Model", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("User Schema Validation", () => {
        it("should create a valid user with required fields", async () => {
            const userData = {
                name: "John Doe",
                email: "john1@example.com",
                password: "password123",
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe(userData.name);
            expect(savedUser.email).toBe(userData.email);
            expect(savedUser.password).not.toBe(userData.password); // Password should be hashed
            expect(savedUser.role).toBe("user"); // Default role
            expect(savedUser.isActive).toBe(true); // Default isActive
            expect(savedUser.createdAt).toBeDefined();
            expect(savedUser.updatedAt).toBeDefined();
        });

        it("should fail validation without required name", async () => {
            const userData = {
                email: "john@example.com",
                password: "password123",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow("Name is required");
        });

        it("should fail validation without required email", async () => {
            const userData = {
                name: "John Doe",
                password: "password123",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow("Email is required");
        });

        it("should fail validation without required password", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow("Password is required");
        });

        // invalid email format
        it("should fail validation with invalid email format", async () => {
            const userData = {
                name: "John Doe",
                email: "invalid-email",
                password: "password123",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow(
                "Please enter a valid email address",
            );
        });

        // Password length validation
        it("should fail validation with password less than 8 characters", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "12345",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow(
                "Password must be at least 8 characters long",
            );
        });

        // name length validation
        it("should fail validation at least 2 character name", async () => {
            const userData = {
                name: "J",
                email: "john@example.com",
                password: "password123",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow(
                "Name must be at least 2 characters long",
            );
        });

        it("should fail validation with name with long character", async () => {
            const userData = {
                name: "J".repeat(51), // 51 characters long
                email: "john@example.com",
                password: "password123",
            };
            const user = new User(userData);
            await expect(user.save()).rejects.toThrow(
                "Name must be at most 50 characters long",
            );
        });

        // email should be unique
        it("should fail validation with duplicate email", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };
            const user1 = new User(userData);
            await user1.save();

            const user2 = new User({
                name: "Jane Doe",
                email: "john@example.com",
                password: "password123",
            });
            await expect(user2.save()).rejects.toThrow("Email already exists");
        });

        // email should be converted to lowercase
        it("should convert email to lowercase", async () => {
            const userData = {
                name: "John Doe",
                email: "JOHN@EXAMPLE.COM",
                password: "password123",
            };
            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser.email).toBe("john@example.com");
        });

        // should trim whitespace from name and email
        it("should trim whitespace from name and email", async () => {
            const userData = {
                name: "  John Doe  ",
                email: "john@example.com ",
                password: "password123",
            };
            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser.name).toBe("John Doe");
            expect(savedUser.email).toBe("john@example.com");
        });
    });

    describe("Password hashing", () => {
        it("should hash password before saving", async () => {
            const plainPassword = "password123";
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: plainPassword,
            };
            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser.password).not.toBe(plainPassword);
            expect(savedUser.password).toMatch(/^\$2[ayb]\$.{56}$/);
        });

        it("should not rehash password if not modified", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };
            const user = new User(userData);
            await user.save();
            const originalHash = user.password;

            user.name = "Jane Doe"; // Modify name only
            await user.save();

            expect(user.password).toBe(originalHash); // Password hash should remain unchanged
        });
    });

    describe("comparePassword Method", () => {
        let user;
        beforeEach(async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };
            user = new User(userData);
            await user.save();
        });
        
        it("should return true for correct password", async () => {
            const isMatch = await user.comparePassword("password123");
            expect(isMatch).toBe(true);
        });

        it("should return false for incorrect password", async () => {
            const isMatch = await user.comparePassword("wrongpassword");
            expect(isMatch).toBe(false);
        });
        
        it("should return false for empty password", async () => {
            const isMatch = await user.comparePassword("");
            expect(isMatch).toBe(false);
        });
        
        it("should return false for null password", async () => {
            const isMatch = await user.comparePassword(null);
            expect(isMatch).toBe(false);
        });
    });
    
    describe("toJSON Method", () => {
        it("should not include password in JSON output", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };
            const user = new User(userData);
            const savedUser = await user.save();
            const userJson = savedUser.toJSON();
            
            expect(userJson).toHaveProperty("name", "John Doe");
            expect(userJson).toHaveProperty("email", "john@example.com");
            expect(userJson).not.toHaveProperty("password");
        });
    });
});
