const express = require("express");
const router = express.Router();
const { loginForm, loginUser, registerForm, registerUser, confirmAccount } = require("../controllers/authController");

router.get("/login", loginForm );
router.post("/login", loginUser );
router.get("/register", registerForm );
router.post("/register", registerUser );
router.get("/confirm-account/:token", confirmAccount );

module.exports = router;
