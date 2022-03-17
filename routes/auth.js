const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  confirmAccount,
  logoutUser,
} = require("../controllers/authController");
const router = express.Router();

router.get("/login", loginForm);
router.post(
  "/login",
  [
    body("email", "Ingrese email valido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese password").trim().isLength({ min: 6 }).escape(),
  ],
  loginUser
);
router.get("/register", registerForm);
router.post(
  "/register",
  [
    body("userName", "Ingrese nombre valido").trim().notEmpty().escape(),
    body("email", "Ingrese email valido").trim().isEmail().normalizeEmail(),
    body("password", "Contrasena minimo 6 caracteres")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Las contrasenas no coinciden");
        }
        return value;
      }),
  ],
  registerUser
);
router.get("/confirm-account/:token", confirmAccount);
router.get("/logout", logoutUser);

module.exports = router;
