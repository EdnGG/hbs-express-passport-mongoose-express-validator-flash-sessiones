const nodemailer = require("nodemailer");
require('dotenv').config();


const sendEmail = async (user) => {
  const transport = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD
    }
  });

  await transport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: user.email, // list of receivers
    subject: "Verifica tu cuenta en tu email" ,// Subject line
    html: `<a href="http://localhost:5000/auth/confirm-account/${user.tokenConfirm}">Verifica tu cuenta aqui</a>`, // html body
  });

}


module.exports = sendEmail;