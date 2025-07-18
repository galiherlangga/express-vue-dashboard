const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getMe);

router.get("/test", (req, res) => {
    res.json({
        message: "Auth route is working",
        timestamp: new Date().toISOString(),
    });
});

console.log("auth route loaded");
module.exports = router;
