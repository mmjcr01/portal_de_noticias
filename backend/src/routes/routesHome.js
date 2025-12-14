/**
 * Rotas Home
 * GET /  -> controller_home.listarArtigos
 * POST /buscar_artigos -> controller_home.buscarArtigos
 */
const express = require('express');
const router = express.Router();
const controller_home = require("../controllers/controller_home.js");


router.get("/", controller_home.listarArtigos);
router.post("/buscar_artigos", controller_home.buscarArtigos);



module.exports = router;