/**
 * Rotas Categorias
 * GET /editar  -> listarCategorias
 * GET /:id_categoria -> buscar_categoria
 * POST /cadastrar_categoria -> incluir/atualizar por `action`
 * POST /deletar_categoria -> deletar categoria
 */
const express = require('express');
const router = express.Router();
const controller_categorias = require('../controllers/controller_categoria.js');
const { isAdmin } = require("../middleware/auth.js");



router.get('/editar', isAdmin , controller_categorias.listarCategorias);
router.get('/:id_categoria', isAdmin, controller_categorias.buscar_categoria);
router.post("/cadastrar_categoria", isAdmin, (req, res) =>{
  const action = req.body.action;
   
if (action === 'incluir') {

 controller_categorias.criar_categoria(req, res);
}
 else if (action === 'atualizar') {
  controller_categorias.atualizar_categoria(req, res);
} else {
  res.status(400).json({ error: 'Ação inválida.' });
}
});
 
router.post('/deletar_categoria', isAdmin, controller_categorias.deletar_categoria);


module.exports = router;