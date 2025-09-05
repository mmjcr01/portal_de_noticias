const db = require('../database/db.js');

// Função para buscar categorias
exports.buscarCategorias = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM categorias', (err, results) => {
      if (err) {
        console.error('Erro ao listar categorias:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Função para buscar autores
exports.buscarAutores = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM autores', (err, results) => {
      if (err) {
        console.error('Erro ao listar autores:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Função para listar artigos
exports.listarArtigos = async (req, res) => {
  try {
    // Buscar artigos
    const artigos = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM vw_artigos;', (err, results) => {
        if (err) {
          console.error('Erro ao listar artigos:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    // Buscar autores
    const autores = await exports.buscarAutores();
    const categorias = await exports.buscarCategorias();

    // Renderizar a view com os dados
    res.render('artigos', { artigos, autores, categorias });
  } catch (err) {
    console.error('Erro ao listar artigos ou autores:', err);
    res.status(500).json({ error: 'Erro ao listar artigos ou autores' });
  }
};

exports.buscar_artigo = (req, res) => {
  const id = req.params.id; 
  
  
  db.query('SELECT * FROM vw_artigos WHERE id_artigo = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro na consulta ao banco' });
    }
    res.render('artigo', {artigo: results[0]});
  });
} 

exports.criar_artigo = (req, res) => {  
  const titulo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;
  const id_autor = req.body.id_autor;
  const id_categoria = req.body.id_categoria;

  db.query('INSERT INTO `portal_noticias`.`artigos` (`titulo_artigo`, `conteudo_artigo`, `id_autor`, `id_categoria`) VALUES (?, ?, ?, ?)', [titulo, conteudo_artigo, id_autor, id_categoria], (err, results) => {
    if (err) {
      console.error('Erro ao criar artigo:', err);
      return res.status(500).json({ error: 'Erro ao criar artigo' });
    }
    res.redirect('/artigos/editar');
  });
}


exports.atualizar_artigo = (req, res) => {
  const id_artigo = req.body.id_artigo;
  const titulo_artigo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;

  db.query('UPDATE artigos SET titulo_artigo = ?, conteudo_artigo = ? WHERE id_artigo = ?', [titulo_artigo, conteudo_artigo, id_artigo], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar artigo:', err);
      return res.status(500).json({ error: 'Erro ao atualizar artigo' });
    }
    res.redirect('/artigos/editar');
  });
}


exports.deletar_artigo = (req, res) => {
  const id = req.body.id_artigo;

  db.query('DELETE FROM artigos WHERE id_artigo = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar artigo:', err);
      return res.status(500).json({ error: 'Erro ao deletar artigo' });
    }
    res.redirect('/artigos/editar');
  });
}
