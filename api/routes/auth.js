const express = require("express");
const { register, login, logout } = require("../controllers/auth.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authenticateToken, logout);

module.exports = router;
