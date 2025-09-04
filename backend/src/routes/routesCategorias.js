const express = require('express');
const router = express.Router();
const controller_categorias = require('../controllers/controller_categoria.js');



router.get('/', controller_categorias.listarCategorias);
router.get('/:id_categoria', controller_categorias.buscar_categoria);
router.post("/cadastrar_categoria", (req, res) =>{
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
 
router.post('/deletar_categoria', controller_categorias.deletar_categoria);


module.exports = router;