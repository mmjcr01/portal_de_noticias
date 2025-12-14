/**
 * Rotas Autores
 * GET /editar  -> listarAutores
 * GET /:id     -> buscar_autor
 * POST /cadastrar_autor -> incluir/atualizar por `action`
 * POST /deletar -> deletar autor
 */
const express = require('express');
const router = express.Router();
const controllerAutores = require('../controllers/controller_autor.js');


router.get('/editar', controllerAutores.listarAutores);
router.get('/:id', controllerAutores.buscar_autor);
router.post('/cadastrar_autor', (req, res) => {
  const action = req.body.action;

  if (action === 'atualizar') {
    controllerAutores.atualizar_autor(req, res);
  } else if (action === 'incluir') {
    controllerAutores.criar_autor(req, res);
  } else {
    res.status(400).json({ error: 'Ação inválida.' });
  }
});

router.post('/deletar', controllerAutores.deletar_autor);


module.exports = router;
