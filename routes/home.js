const express = require("express");
const { body } = require("express-validator");

const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redireccionamiento,
} = require("../controllers/homeController");
const { formProfile, editProfilePicture } = require("../controllers/profileController");
const urlValidar = require("../middlewares/urlValida");
const verificarUser = require("../middlewares/verificarUser");

const router = express.Router();

router.get(
  "/",
  verificarUser,
  [body("origin", "Ingrese URL valida").trim().notEmpty().escape()],
  leerUrls
); // ruta protegida
router.post("/", verificarUser ,urlValidar, agregarUrl);
router.get("/eliminar/:id", verificarUser, eliminarUrl);
router.get("/editar/:id", verificarUser, editarUrlForm);
router.post("/editar/:id", verificarUser, urlValidar, editarUrl);

router.get("/profile", verificarUser, formProfile);
router.post("/profile", verificarUser, editProfilePicture);

router.get("/:shortURL", redireccionamiento);

module.exports = router;
 