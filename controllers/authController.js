const User = require("../models/User");
const { validationResult } = require("express-validator");
const sendEmail = require('../utils/mail.js');
require('dotenv').config();
const { nanoid } = require("nanoid");

const loginForm = async (req, res) => {
    // res.render("login", { mensajes: req.flash("mensajes") });
    res.render("login");
};

const registerForm = async (req, res) => {
  
    res.render("register")
      // mensajes: req.flash("mensajes"),
      // csrfToken: req.csrfToken(),
    
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.json(errors.array())
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }

  const { email, password, userName } = req.body;
  try {
    let user = await User.findOne({ email: email });
    // throw new error manda un error a la funcion catch
    if (user) throw new Error("El usuario ya existe");
    user = new User({ email, password, userName, tokenConfirm: nanoid(6) });

    await user.save();
    await sendEmail(user)
  
    req.flash("mensajes", [{ msg: "Revisa tu email y valida cuenta" }]);
    res.redirect("/auth/login");
    res.json(user);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    res.redirect("/auth/register");
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });

    if (!user) throw new Error("El token no es valido");

    user.cuentaConfirmada = true;
    user.tokenConfirm = null;

    await user.save();

    req.flash("mensajes", [{ msg: "Cuenta verificada correctamente" }]);

    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("El usuario no existe");

    if (!user.cuentaConfirmada) throw new Error("La cuenta no esta confirmada");

    if (!(await user.comparePassword(password)))
      throw new Error("Contrasena incorrecta");

    // Creando la sesion de usuario a travez de passport
    req.login(user, function (err) {
      if (err) throw new Error("Error al crear la sesion con passport");
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    req.flash("mensajes", [{ msg: error.message }]);
    res.redirect("/auth/login");
    //  res.send(error.message);
  }
};

const logoutUser = async (req, res) => {
  req.logout();
  res.redirect("/");
};

module.exports = {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  confirmAccount,
  logoutUser,
};
