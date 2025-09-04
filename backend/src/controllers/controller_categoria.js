const db = require('../database/db.js');

exports.listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      console.error('Erro ao listar categorias:', err);
      return res.status(500).json({ error: 'Erro ao listar categorias' });
    }
    res.render('categorias', { categorias: results });
  });
}

exports.buscar_categoria = (req, res) => {
  db.query('SELECT * FROM categorias WHERE id_categoria = ?', [req.params.id_categoria], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro na consulta ao banco' });
    }
    res.json(results);
  });
}

exports.criar_categoria = (req, res) => { 
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;
  
  db.query('INSERT INTO `portal_noticias`.`categorias` (`nome_categoria`,`descricao_categoria`,`cor_tema`,`ativo`) VALUES(?,?,?,?)', [nome_categoria, descricao_categoria, cor_tema, ativo], (err, results) => {
    if (err) {
      console.error('Erro ao criar categoria:', err);
      return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  });
 res.redirect("/categorias")
}

exports.atualizar_categoria = (req, res) => { 
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;
  const id_categoria = req.body.id_categoria;
  
  
  db.query('UPDATE categorias SET nome_categoria = ?, descricao_categoria = ?, cor_tema = ?, ativo = ? WHERE id_categoria = ?', [nome_categoria, descricao_categoria, cor_tema, ativo, id_categoria], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar categoria:', err);
      return res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
    res.redirect("/categorias")
  });
 
}
exports.deletar_categoria = (req, res) => {
  const id_categoria = req.body.id_categoria;
  
  db.query('DELETE FROM categorias WHERE id_categoria = ?', [id_categoria], (err, results) => {
    if (err) {
      console.error('Erro ao deletar categoria:', err);
      return res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
     res.redirect("/categorias")
  });
}
