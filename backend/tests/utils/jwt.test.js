const { generateToken, verifyToken } = require("../../src/config/jwt");

describe("JWT Utilities", () => {
    describe("generateToken", () => {
        it("should generate a valid JWT token", () => {
            const payload = {
                userId: "64a5b8c9d1234567890abcde",
                email: "john@example.com",
            };

            const token = generateToken(payload);
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
        });

        it("should generate different tokens for different payloads", () => {
            const payload1 = { userId: "64a5b8c9d1234567890abcde" };
            const payload2 = { userId: "64a5b8c9d1234567890abcdf" };

            const token1 = generateToken(payload1);
            const token2 = generateToken(payload2);

            expect(token1).not.toBe(token2);
        });

        it("should include expiration in token", () => {
            const payload = {
                userId: "64a5b8c9d1234567890abcde",
                email: "john@example.com",
            };
            const token = generateToken(payload);
            const decoded = verifyToken(token);

            expect(decoded).toHaveProperty("exp");
            expect(decoded).toHaveProperty("iat");
            expect(decoded.exp).toBeGreaterThan(Date.now() / 1000); // exp
        });
    });

    describe("verifyToken", () => {
        it("should verify a valid JWT token", () => {
            const payload = {
                userId: "64a5b8c9d1234567890abcde",
                email: "john@example.com",
            };
            const token = generateToken(payload);
            const decoded = verifyToken(token);
            expect(decoded).toHaveProperty("userId", payload.userId);
            expect(decoded).toHaveProperty("email", payload.email);
        });

        it("should throw error for invalid token", () => {
            const invalidToken = "invalid.token.string";

            expect(() => verifyToken(invalidToken)).toThrow("Invalid token");
        });
        
        it("should throw error for malformed token", () => {
           const malformedToken = "malformed-token-string";

            expect(() => verifyToken(malformedToken)).toThrow("Invalid token"); 
        });
        
        // empty token
        it("should throw error for empty token", () => {
            const emptyToken = "";

            expect(() => verifyToken(emptyToken)).toThrow("Invalid token");
        });
        
        // null token
        it("should throw error for null token", () => {
            const nullToken = null;

            expect(() => verifyToken(nullToken)).toThrow("Invalid token");
        });
    });
});
