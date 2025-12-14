/**
 * Rotas Cadastro
 * GET /               -> controller_cadastro.Cadastro
 * POST /cadastrar_usuario -> controller_cadastro.cadastrarUsuario
 */
const express = require("express");
const router = express.Router();
const controller_cadastro = require("../controllers/controller_cadastro");




router.get("/", controller_cadastro.Cadastro);
router.post("/cadastrar_usuario", controller_cadastro.cadastrarUsuario);



module.exports = router;