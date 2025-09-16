const db = require('../database/db.js');


exports.listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      console.error('Erro ao listar categorias:', err);
      return res.status(500).json({ error: 'Erro ao listar categorias' });
    }
    res.render('index', {categorias: results});
  });
}

