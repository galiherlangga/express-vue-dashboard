const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");
const { generateToken } = require("../../src/config/jwt");

describe("User Routes", () => {
    let adminUser;
    let regularUser;
    let adminToken;
    let userToken;

    beforeEach(async () => {
        await User.deleteMany({});

        // Create an admin user
        adminUser = new User({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
        });
        await adminUser.save();

        regularUser = new User({
            name: "Regular User",
            email: "user1@example.com",
            password: "password123",
            role: "user",
        });
        await regularUser.save();

        adminToken = generateToken({
            userId: adminUser._id.toString(),
            email: adminUser.email,
        });

        userToken = generateToken({
            userId: regularUser._id.toString(),
            email: regularUser.email,
        });
    });

    describe("GET /api/users", () => {
        it("should get all users with admin token", async () => {
            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);

            const res_body = response.body;
            expect(res_body.success).toBe(true);
            expect(res_body.data.users).toHaveLength(2);
            expect(res_body.data.pagination).toBeDefined();
        });

        it("should fail without token", async () => {
            const response = await request(app).get("/api/users").expect(401);
            expect(response.body.message).toBe(
                "Access denied. No token provided.",
            );
        });

        it("should fail with regular user token", async () => {
            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(401);
            expect(response.body.message).toBe(
                "Access denied. Admins privileges required.",
            );
        });
    });

    describe("GET /api/users/:id", () => {
        it("should get user by ID with admin token", async () => {
            const response = await request(app)
                .get(`/api/users/${regularUser._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);

            const res_body = response.body;
            expect(res_body.success).toBe(true);
            expect(res_body.data.email).toBe(regularUser.email);
            expect(res_body.data.password).toBeUndefined(); // Password should not be returned
        });

        it("should return 404 for invalid ID format", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("User not found");
        });

        it("should return 400 for invalid ID format", async () => {
            const response = await request(app)
                .get("/api/users/invalid-id")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid user ID format");
        });
    });

    describe("POST /api/users", () => {
        it("should create new user with admin token", async () => {
            const newUser = {
                name: "New User",
                email: "newuser@example.com",
                password: "password123",
                role: "user",
            };

            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newUser)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(newUser.email);
            expect(response.body.data.password).toBeUndefined();
        });

        it("should fail with missing required fields", async () => {
            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Test User" })
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("required");
        });

        it("should fail with duplicate email", async () => {
            const duplicateUser = {
                name: "Duplicate User",
                email: "admin@example.com",
                password: "password123",
            };
            
            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(duplicateUser)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("already exists");
        });
    });
    
    describe("PUT /api/users/:id", () => {
        it("should update user by ID with admin token", async () => {
            const updatedData = { name: "Updated User", email: "updated@example.com" };

            const response = await request(app)
                .put(`/api/users/${regularUser._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(updatedData.name);
            expect(response.body.data.email).toBe(updatedData.email);
        });

        it("should return 404 for non-existing user ID", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/users/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Non-existing User" })
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("User not found");
        });
    });
    
    describe("DELETE /api/users/:id", () => {
        it("should delete user with admin token", async () => {
            const response = await request(app)
                .delete(`/api/users/${regularUser._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("User deleted successfully");
        });

        it("should prevent admin from deleting themselves", async () => {
            const response = await request(app)
                .delete(`/api/users/${adminUser._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Cannot delete your own account");
        });

        it("should return 404 for non-existent user", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/users/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("User not found");
        });
    });
});
