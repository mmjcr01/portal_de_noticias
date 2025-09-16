const express = require('express');
const router = express.Router();
const controller_home = require("../controllers/controller_home.js");


router.get("/", controller_home.listarCategorias);



module.exports = router;