const db = require('../database/db.js');

exports.listarAutores = (req, res) => {
  db.query('SELECT * FROM autores', (err, results) => {
    if (err) {
      console.error('Erro ao listar autores:', err);
      return res.status(500).json({ error: 'Erro ao listar autores' });
    }
    // res.json(results);
    res.render('autores',  { autores: results });
  });
}

exports.buscar_autor = (req, res) => {
 db.query('select * from autores where id_autor = ?', [req.params.id], (err, results) => {    
      if (err) {
        return res.status(500).json({ erro: 'Erro na consulta ao banco' });
      }
      res.json(results);
    });
  };;
  exports.criar_autor = (req, res) => {
    const nome = req.body.nome_autor;
    const email = req.body.email_autor;
    const senha = req.body.senha_autor;
    db.query('INSERT INTO `portal_noticias`.`autores` (`nome_autor`,`email_autor`,`senha_autor`)VALUES(?,?,?)', [nome, email, senha], (err, results) => {
      if (err) {
        console.error('Erro ao criar autor:', err);
        return res.status(500).json({ error: 'Erro ao criar autor' });
      }
      // res.status(201).json({ message: 'Autor criado com sucesso', id: results.insertId });
    });
     res.redirect('/autores');
  }


  exports.atualizar_autor = (req, res) => {
    const id = req.body.id_autor;
    const nome_autor = req.body.nome_autor;
    const email_autor = req.body.email_autor; 
    const senha_autor = req.body.senha_autor;
    
    db.query('UPDATE autores SET nome_autor = ?, email_autor = ?, senha_autor = ? WHERE id_autor = ?', [nome_autor, email_autor, senha_autor, id], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar autor:', err);
        return res.status(500).json({ error: 'Erro ao atualizar autor' });
      }
      res.redirect('/autores');
    });
  }


exports.deletar_autor = (req, res) => {
  const id = req.body.id_autor;
  
  db.query('DELETE FROM autores WHERE id_autor = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar autor:', err);
      return res.status(500).json({ error: 'Erro ao deletar autor' });
    }
    res.redirect('/autores');
  });
}