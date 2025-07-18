const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const User = require("../../src/models/User");
const { generateToken } = require("../../src/config/jwt");
const { authenticate } = require("../../src/middleware/auth");

// Create a test app specifically for middleware testing
const createTestApp = () => {
    const app = express();

    // Basic middleware
    app.use(express.json());

    // Test route with authentication middleware
    app.get("/api/test/protected", authenticate, (req, res) => {
        res.json({
            message: "Protected route accessed",
            user: req.user,
        });
    });

    // Error handling for 404
    app.use("*", (req, res) => {
        res.status(404).json({
            message: "Endpoint not found",
        });
    });

    return app;
};

describe("Authentication Middleware", () => {
    let testUser;
    let validToken;
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(async () => {
        // Clear users collection
        await User.deleteMany({});

        // Create test user
        testUser = new User({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        });
        await testUser.save();

        // Generate valid token
        validToken = generateToken({
            userId: testUser._id.toString(),
            email: testUser.email,
        });
    });

    describe("Valid Authentication", () => {
        it("should allow access with valid Bearer token", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", `Bearer ${validToken}`)
                .expect(200);

            expect(response.body.message).toBe("Protected route accessed");
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(testUser.email);
            expect(response.body.user.password).toBeUndefined();
        });

        it("should attach user object to request", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", `Bearer ${validToken}`)
                .expect(200);

            expect(response.body.user._id).toBe(testUser._id.toString());
            expect(response.body.user.name).toBe(testUser.name);
            expect(response.body.user.email).toBe(testUser.email);
            expect(response.body.user.role).toBe(testUser.role);
        });
    });

    describe("Invalid Authentication", () => {
        it("should reject request without Authorization header", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .expect(401);

            expect(response.body.message).toBe(
                "Access denied. No token provided.",
            );
        });

        it("should reject request with empty Authorization header", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", "")
                .expect(401);

            expect(response.body.message).toBe(
                "Access denied. No token provided.",
            );
        });

        it("should reject request without Bearer prefix", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", validToken)
                .expect(401);

            expect(response.body.message).toBe(
                "Access denied. No token provided.",
            );
        });

        it("should reject request with invalid token format", async () => {
            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", "Bearer invalid-token")
                .expect(401);

            expect(response.body.message).toBe("Access denied. Invalid token.");
        });

        it("should reject request for non-existent user", async () => {
            const fakeToken = generateToken({
                userId: new mongoose.Types.ObjectId().toString(),
                email: "nonexistent@example.com",
            });

            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", `Bearer ${fakeToken}`)
                .expect(401);

            expect(response.body.message).toBe(
                "Access denied. User not found or inactive.",
            );
        });

        it("should reject request for inactive user", async () => {
            testUser.isActive = false;
            await testUser.save();

            const response = await request(app)
                .get("/api/test/protected")
                .set("Authorization", `Bearer ${validToken}`)
                .expect(401);

            expect(response.body.message).toBe(
                "Access denied. User not found or inactive.",
            );
        });
    });
});
