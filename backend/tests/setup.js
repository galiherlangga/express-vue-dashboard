process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key";
const originalUri = process.env.MONGODB_URI;
if (originalUri && originalUri.includes("express_db")) {
    process.env.MONGODB_URI = originalUri.replace(
        "express_db",
        "express_db_test",
    );
} else {
    process.env.MONGODB_URI = "mongodb://localhost:27017/express_db_test";
}

jest.setTimeout(30000);

const mongoose = require("mongoose");

beforeAll(async () => {
    console.log("Starting test...");
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("Error during test setup:", error);
        throw error;
    }
});

afterAll(async () => {
    console.log("Test completed");
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("Disconnected from test database");
        }
    } catch (error) {
        console.error("Error during test teardown:", error);
    }
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at: ", promise, "reason", reason);
});
