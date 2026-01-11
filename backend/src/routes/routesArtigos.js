/**
 * Rotas Artigos
 * GET /editar  -> listarArtigos (editor)
 * GET /:id_artigo -> buscar_artigo
 * GET /         -> cadastro de artigo
 * POST /cadastrar_artigo -> upload + criar/atualizar artigo via `action`
 */
const express = require('express');
const router = express.Router();
const controller_artigo = require('../controllers/controller_artigo.js');
const uploadArquivo = controller_artigo.uploadArquivo;
const { isAdmin } = require("../middleware/auth.js");



router.get('/editar', isAdmin, controller_artigo.listarArtigos);
router.get('/:id_artigo', controller_artigo.buscar_artigo);
router.get('/', controller_artigo.cadastro)
router.post('/cadastrar_artigo', isAdmin, uploadArquivo.single("imagem_destaque_artigo"), (req, res) => {
  const action = req.body.action;

  if (action === 'incluir') {
    controller_artigo.criar_artigo(req, res);
  } else if (action === 'atualizar') {
    controller_artigo.atualizar_artigo(req, res);
  } else {
    res.status(400).json({ error: 'Ação inválida' });
  }
 });
router.post('/deletar_artigo', controller_artigo.deletar_artigo);


module.exports = router;