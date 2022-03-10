const User = require("../models/User");
const { nanoid } = require('nanoid')
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
    res.json(user);
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


module.exports = {
  loginForm,
  registerForm,
  registerUser
}