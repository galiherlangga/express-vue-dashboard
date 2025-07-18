const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default-key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
const APP_NAME = process.env.APP_NAME || "express-dashboard";

const generateToken = (payload) => {
    try {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
            issuer: APP_NAME,
            audience: APP_NAME,
        });
    } catch (error) {
        throw new Error("Token generation failed: " + error.message);
    }
}

const verifyToken = (token) => {
    try {
        if (!token) {
            throw new Error('Invalid token');
        }
        
        return jwt.verify(token, JWT_SECRET, {
            issuer: APP_NAME,
            audience: APP_NAME,
        });
    } catch (error) {
        console.log(error.message);
        throw new Error('Invalid token');
    }
}

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET,
    JWT_EXPIRATION,
};