/**
 * Controller Artigo
 * Responsável por CRUD de artigos e upload de imagem de destaque.
 * Upload:
 * - Configura `multer` com storage em `/public/css/assets/images`
 * - Gera nome de arquivo seguro baseado no nome original + timestamp
 * Exporta:
 * - uploadArquivo: instância do multer para uso nas rotas (ex.: uploadArquivo.single('campo'))
 */
const db = require('../database/db.js');
const multer = require("multer");
const path = require('path');
const sessaoUsuarioController = require('./controler_sessaoUsuario.js');

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

/**
 * Instância do multer com storage configurado.
 * Use nas rotas: uploadArquivo.single('imagem_destaque_artigo')
 */
const uploadArquivo = multer({ storage });
exports.uploadArquivo = uploadArquivo;




// Função para buscar categorias
/**
 * Lista todas as categorias ordenadas por nome.
 * @returns {Promise<Array>} categorias
 */
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
/**
 * Lista todos os autores.
 * @returns {Promise<Array>} autores
 */
exports.buscarUsuarios = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        console.error('Erro ao listar autores:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Função para listar artigos
/**
 * Renderiza o editor de artigos com lista de artigos, autores e categorias.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
    const usuarios = await exports.buscarUsuarios();
    const categorias = await exports.buscarCategorias();

    // Renderizar a view com os dados
    res.render('artigos_editor', { artigos, usuarios, categorias, base_imagem: base_imagem  });
  } catch (err) {
    console.error('Erro ao listar artigos ou autores:', err);
    res.status(500).json({ error: 'Erro ao listar artigos ou autores' });
  }
};

/**
 * Exibe a página de um artigo específico e registra acesso do usuário (se logado).
 * @param {import('express').Request} req - req.params.id_artigo
 * @param {import('express').Response} res
 */
exports.buscar_artigo = (req, res) => {
  const id_artigo = req.params.id_artigo;
  const base_imagem = "/css/assets/images/";
  const login = req.session.user;
 


  db.query('SELECT * FROM vw_artigos WHERE id_artigo = ?', [id_artigo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro na consulta ao banco' });
    };
    if (!results[0]) {
      return res.status(404).send('Artigo não encontrado');
    };
    if (login) {
      const id_usuario = login.id_usuario;
      const id_categoria = results[0].id_categoria;
      sessaoUsuarioController.artigoClicado(id_usuario, id_artigo, id_categoria);
    };
    res.render('artigo', {
      login: login || null,
      artigo: results[0], // Envia o primeiro resultado como `artigo`
      base_imagem,
    });

  
  });
} 

/**
 * Cria um novo artigo.
 * @param {import('express').Request} req - req.file.filename (imagem), campos do body
 * @param {import('express').Response} res
 */
exports.criar_artigo = (req, res) => {  
  const titulo_artigo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;
  const resumo_artigo = req.body.resumo_artigo;
  const alt_imagem = req.body.alt_imagem;
  const data_publicacao = req.body.data_publicacao;
  const id_categoria = req.body.id_categoria;
  const id_usuario = req.body.id_usuario
  const destaque = req.body.destaque
  const imagem_destaque_artigo = req.file ? req.file.filename : req.body.imagem_destaque_artigo;

  

  db.query('INSERT INTO `portal_noticias`.`artigos` (titulo_artigo, resumo_artigo, conteudo_artigo, alt_imagem, id_categoria , id_autor, data_publicacao, destaque, imagem_destaque_artigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [titulo_artigo, resumo_artigo, conteudo_artigo, alt_imagem, id_categoria , id_usuario, data_publicacao, destaque, imagem_destaque_artigo], (err, results) => {
    if (err) {
      console.error('Erro ao criar artigo:', err);
      return res.status(500).json({ error: 'Erro ao criar artigo' });
    }
    
    res.redirect('/artigos/editar');
  });
}

/**
 * Atualiza um artigo existente.
 * @param {import('express').Request} req - req.file.filename (opcional), body inclui id_artigo
 * @param {import('express').Response} res
 */
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

/**
 * Deleta um artigo.
 * @param {import('express').Request} req - req.body.id_artigo
 * @param {import('express').Response} res
 */
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

/**
 * Renderiza a view de cadastro de artigo.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.cadastro = async(req, res) =>{
  const categorias = await exports.buscarCategorias()
  res.render("cadastro_artigo", {categorias: categorias, login: req.session.user})

};


