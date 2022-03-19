require('dotenv').config();
const mongoose = require("mongoose");


const clientDB = mongoose
    .connect(process.env.URI)
    .then((res) => {
        console.log("db conectada 🔥")
        return res.connection.getClient();
    })
    .catch((e) => console.log("falló la conexión " + e));


module.exports = clientDB;