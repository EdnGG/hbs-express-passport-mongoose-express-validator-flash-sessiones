const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
    // console.log('Este objeto lo crea passport: ', req.user)
    try {
        // .lean() = js objects, not mongoose objects
        const urls = await Url.find({user: req.user.id}).lean();
        return res.render("home", { urls: urls });
    } catch (error) {
        // console.log(error);
        // res.send("falló algo...");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const agregarUrl = async (req, res) => {
    const { origin } = req.body;
 
    try {
        const url = new Url({ origin: origin, shortURL: nanoid(8), user: req.user.id }); // user: req.user._id
        await url.save();
        req.flash("mensajes", [{ msg: "URL agregada" }]);
        res.redirect("/");
    } catch (error) {
        // console.log(error);
        // res.send("error algo falló");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        // await Url.findByIdAndDelete(id);
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("No tienes permisos para eliminar esta URL");
        }

        await url.remove();
        req.flash("mensajes", [{ msg: "URL Eliminada" }]);
        return res.redirect("/");
    } catch (error) {
        // console.log(error);
        // res.send("error algo falló");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean(); 

        if(!url.user.equals(req.user.id)){
            throw new Error("No tienes permisos para eliminar esta URL");
        }
        // const url = await Url.findById(id).lean();
        res.render("home", { url });
    } catch (error) {
        // console.log(error);
        // res.send("error algo falló");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    console.log(`ID ${ id }`)
    try {
        const url = await Url.findById(id);

        if(!url.user.equals(req.user.id)) 
            throw new Error("No tienes permisos para editar esta URL");
        

        await url.updateOne({ origin });
        req.flash("mensajes", [{ msg: "URL editada" }]);

        // await Url.findByIdAndUpdate(id, { origin: origin });
        return res.redirect("/");
    } catch (error) {
        // console.log(error);
        // res.send("error algo falló");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params;
    // console.log(shortURL);
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL });
        return res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg: "No existe esata URL configurada" }]);
        return res.redirect("/auth/login");
    }
};

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
};
