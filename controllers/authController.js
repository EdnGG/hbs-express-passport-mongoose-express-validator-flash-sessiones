const User = require("../models/User");
const { nanoid } = require('nanoid');
// const bcrypt = require('bcryptjs');

const registerForm = async (req, res) => {
  const {} = req.body;
  try {
    res.render("register");
  } catch (error) {
  }
}

const registerUser = async (req, res) => {
  const {email, password, userName} = req.body;
  try {
    let user = await User.findOne({email: email})
    // throw new error manda un error a la funcion catch
    if(user) throw new Error("El usuario ya existe");
    user = new User({email, password, userName, tokenConfirm: nanoid(6) }) 
    await user.save();
    // Enviar email con la confirmacion de la cuenta

    res.redirect("/auth/login");
    res.json(user);
  } catch (error) {
    res.json({error: error.message});
  }
}

const confirmAccount = async (req, res) => {
  const { token } = req.params
  try {
    const user = await User.findOne({tokenConfirm: token})
    if(!user) throw new Error('El token no es valido')
    user.cuentaConfirmada = true
    user.tokenConfirm = null
    await user.save()
    res.redirect("/auth/login")
    // res.json(token)
  } catch (error) {
    res.json({error: error.message});
    
  }
}

const loginForm = async (req, res) => {
  const {} = req.body;
  try {
     res.render("login");
  } catch (error) {
     
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email})
    if (!user) throw new Error("El usuario no existe");

    // console.log(`Usuario confirmado: ${user}`);
    if(!user.cuentaConfirmada) throw new Error("La cuenta no esta confirmada")

    if(!await user.comparePassword(password)) throw new Error("Contrasena incorrecta")

    res.redirect("/");

  } catch (error) {
     console.log(error);
     res.send(error.message);
  }
};


module.exports = {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  confirmAccount
}