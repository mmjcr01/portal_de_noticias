/**
 * Rotas Usuários
 * GET /editar  -> buscarUsuarios
 * POST /cadastrar_usuario -> incluir/atualizar por `action`
 * POST /deletar_usuario -> deletar usuário
 */

const { isAdmin } = require("../middleware/auth.js");
const express = require('express');
const router = express.Router();
const controller_usuario = require('../controllers/controller_usuario.js');

router.get('/editar' ,controller_usuario.buscarUsuarios);
router.post('/cadastrar_usuario', (req, res) => {
  const action = req.body.action;

  if (action === 'incluir') {
    controller_usuario.cadastrarUsuario(req, res);
  } else if (action === 'atualizar') {
   isAdmin, controller_usuario.atualizarUsuario(req, res);
  } else {
    res.status(400).json({ error: 'Ação inválida' });
  }
});
router.post('/deletar_usuario', isAdmin, controller_usuario.deletarUsuario);

module.exports = router;