/**
 * Rotas Login
 * GET /             -> controller_login.login
 * POST /autenticar_login -> controller_login.loginAutenticacao
 * GET /logout       -> controller_login.logout
 */
const express = require("express");
const router = express.Router();
const controllerLogin = require("../controllers/controller_login");



router.get("/", controllerLogin.login);
router.post('/autenticar_login', controllerLogin.loginAutenticacao);
router.get("/logout", controllerLogin.logout);






module.exports = router;