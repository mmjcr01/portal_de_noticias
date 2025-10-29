const db = require('../database/db.js');
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/css/assets/images'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    const baseName = path.basename(file.originalname, ext)
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "") // remove caracteres especiais
      .replace(/[^a-zA-Z0-9-_]/g, "_") // troca espaços e símbolos por "_"
      .toLowerCase();

    // Gera algo como: artigo-1729962945920.png
    const nomeSeguro = `${baseName}-${Date.now()}${ext}`;

    cb(null, nomeSeguro);
  }
});

const uploadArquivo = multer({ storage });
exports.uploadArquivo = uploadArquivo;




// Função para buscar categorias
exports.buscarCategorias = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM categorias order by nome_categoria', (err, results) => {
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
  const base_imagem = "/css/assets/images/";
  try {
    // Buscar artigos
    const artigos = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM vw_artigos order by nome_categoria', (err, results) => {
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
    res.render('artigos_editor', { artigos, autores, categorias, base_imagem: base_imagem  });
  } catch (err) {
    console.error('Erro ao listar artigos ou autores:', err);
    res.status(500).json({ error: 'Erro ao listar artigos ou autores' });
  }
};


exports.buscar_artigo = (req, res) => {
  const id = req.params.id; 
  const base_imagem = "/css/assets/images/";
  
  
  db.query('SELECT * FROM vw_artigos WHERE id_artigo = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro na consulta ao banco' });
    }
    res.render('artigo', {login: req.session.user|| null ,artigo: results[0], base_imagem});
  });
} 


exports.criar_artigo = (req, res) => {  
  const titulo_artigo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;
  const resumo_artigo = req.body.resumo_artigo;
  const alt_imagem = req.body.alt_imagem;
  const data_publicacao = req.body.data_publicacao;
  const id_categoria = req.body.id_categoria;
  const id_autor = req.body.id_autor
  const destaque = req.body.destaque
  const imagem_destaque_artigo = req.file ? req.file.filename : req.body.imagem_destaque_artigo;

  

  db.query('INSERT INTO `portal_noticias`.`artigos` (titulo_artigo, resumo_artigo, conteudo_artigo, alt_imagem, id_categoria , id_autor, data_publicacao, destaque, imagem_destaque_artigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [titulo_artigo, resumo_artigo, conteudo_artigo, alt_imagem, id_categoria , id_autor, data_publicacao, destaque, imagem_destaque_artigo], (err, results) => {
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
  const resumo_artigo = req.body.resumo_artigo;
  const alt_imagem = req.body.alt_imagem;
  const data_publicacao = req.body.data_publicacao;
  const id_categoria = req.body.id_categoria;
  const id_autor = req.body.id_autor
  const destaque = req.body.destaque
  const imagem_destaque_artigo = req.file ? req.file.filename : req.body.imagem_destaque_artigo;



  db.query('UPDATE artigos SET titulo_artigo = ?, resumo_artigo = ?, conteudo_artigo = ?, alt_imagem = ? , id_categoria = ? , id_autor = ? , data_publicacao =  ? ,destaque = ?, imagem_destaque_artigo = ?  WHERE id_artigo = ? ', 
    [titulo_artigo, resumo_artigo, conteudo_artigo, alt_imagem, id_categoria , id_autor, data_publicacao, destaque, imagem_destaque_artigo, id_artigo], (err, results) => {
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


