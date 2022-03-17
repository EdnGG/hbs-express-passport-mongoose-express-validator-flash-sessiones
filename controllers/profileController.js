const User = require("../models/User");
const formidable = require("formidable");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const formProfile = async (req, res) => {
  return res.render("profile");
};

const editProfilePicture = async (req, res) => {
  // return res.json({ ok: true})
  const form = new formidable.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024; // 50 mb

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error("Fallo formidable, subida de imagen");

      console.log("fields :", fields);
      console.log("files :", files);

      const image = files.myFile;

      if (image.originalFileName === "")
        throw new Error("No se ha seleccionado ninguna imagen");

      // if (
      //   !(image.mimetype === "image/jpeg" || image.mimetype === "image/png")
      // ) {
      //   throw new Error(
      //     "Formato de imagen no valido, solo se aceptan jpeg y png"
      //   );
      // }

      const imageTypes = ["image/jpeg", "image/png"];

      if (!imageTypes.includes(image.mimetype)) {
        throw new Error(
          "Formato de imagen no valido, solo se aceptan jpeg y png"
        );
      }

      if (image.size > 50 * 1024 * 1024)
        throw new Error(
          "La imagen es demasiado grande, menos de 5 mb porfavor"
        );

      const extension = image.mimetype.split("/")[1];
      const dirFile = path.join(
        __dirname,
        `../public/img/profiles/${req.user.id}.${extension}`
      );

      fs.renameSync(image.filepath, dirFile);

      const resizedImage = await Jimp.read(dirFile)
      resizedImage.resize(200, 200).quality(90).writeAsync(dirFile);

      const user = await User.findByIdAndUpdate(req.user.id)
      user.imagen = `${req.user.id}.${extension}`;
      await user.save();

      req.flash("mensajes", [{ msg: "image was uploaded" }]);
    } catch (error) {
      req.flash("mensajes", [{ msg: error.message }]);
    } finally {
      return res.redirect("/profile");
    }
  });
};

module.exports = {
  formProfile,
  editProfilePicture,
};
