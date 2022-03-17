const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
const csrf = require("csurf");

const User = require("./models/User");
require("dotenv").config();
require("./database/db");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_SECRET_NAME,
  })
);

/* Example of how to use express-sessions
    app.get("/ruta-protegida" , (req, res) => {
        res.json(req.session.usuario || "sin sesion de usuario")
    })

    app.get("/crear-sesion", (req, res) => {
        req.session.usuario = "Eden";
        res.redirect("/ruta-protegida")
    })

    app.get("/destruir-sesion", (req, res) => {
        res.session.destroy();
        res.redirect("/ruta-protegida")
    })
*/

app.use(flash());

/** Example of how to use flash 
 
    app.get("/mensaje-flash", (req, res) => {
        res.json(req.flash("mensaje"))
    })
     app.get("/crear-mensaje", (req, res) => {
        req.flash("mensaje", "mensaje de prueba")
        res.redirect("/mensaje-flash")
    })

* **/

app.use(passport.initialize());
app.use(passport.session());

/* preguntas   example of how to use passport */ 
passport.serializeUser((user, done) =>  done(null, { id: user._id, userName: user.userName})) // req.user
passport.deserializeUser( async (user, done) => {
    // console.log("deserializeUser");
    const userDB = await User.findById(user.id)
    return done(null, { id: userDB._id, userName: userDB.userName});
})

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));
// Middleware de abajo para formularios
app.use(express.urlencoded({ extended: true }));

app.use(csrf());

// Mandar crsfToken de forma global, tambien manda los mensaje del alert
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
})

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("servidor andando 😍 " + PORT));
