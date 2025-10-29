const db = require('../database/db.js');


// Função para buscar categorias
exports.buscarCategorias = async() => {
  return new Promise((resolve, reject) => {
    db.query('select distinct c.id_categoria, c.nome_categoria, c.descricao_categoria, c.cor_tema, c.ativo from categorias as c, artigos as a where c.id_categoria = a.id_categoria and a.destaque = 0;', (err, results) => {
      if (err) {
        console.error('Erro ao listar categorias:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

exports.listarArtigosDestaque = async (req, res) => {
  const base_imagem = "/css/assets/images/";
  try {
    const artigos_destaque = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM vw_artigos where destaque > 0 order by nome_categoria', (err, results) => {
        if (err) {
          console.error('Erro ao listar artigos:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    return artigos_destaque; // Retorna os dados corretamente
  } catch (err) {
    console.error('Erro ao listar artigos ou autores:', err);
    throw err; // Lança o erro para ser tratado na função chamadora
  }
};


exports.listarArtigos = async (req, res) => {
  const base_imagem = "/css/assets/images/";
  try {
    // Buscar artigos sem destaque
    const artigos = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM vw_artigos where destaque = 0 order by nome_categoria;', (err, results) => {
        if (err) {
          console.error('Erro ao listar artigos:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    // Buscar artigos com destaque
    const artigos_destaque = await exports.listarArtigosDestaque(req, res);
    const categorias = await exports.buscarCategorias();
    // Renderizar a view com os dados
    res.render("index", { login: req.session.user|| null, artigos, artigos_destaque, categorias, base_imagem });
  } catch (err) {
    console.error('Erro ao listar artigos ou autores:', err);
    res.status(500).json({ error: 'Erro ao listar artigos ou autores' });
  }
};



exports.buscar_artigo_por_categoria = async (req, res) => {
  const id_categoria = req.params.id_categoria; 
  try{
  const artigos = await new promise((resolve, reject) => { 
  db.query('SELECT * FROM vw_artigos WHERE id_categoria = ?', [id_categoria], (err, results) => {
    if (err) {
      
      return reject(res.status(500).json({ error: 'Erro na consulta ao banco' }));
    }
    resolve(results);
  }); 
 });
   // res.render("teste" , {artigos})
  }  catch(err) {
    console.error('Erro ao listar artigos:', err);
    res.status(500).json({ error: 'Erro ao listar artigos' });
  }
} 



exports.buscarArtigos = (req,res) => {
  const busca = req.body.busca;
  const base_imagem = "/css/assets/images/";
  
  db.query('select * from artigos where resumo_artigo like CONCAT("%", ?, "%");', [busca], (err, results) =>{
  if (err) {
      console.error('Erro ao listar artigos:', err);
      return reject(err);
  }
  console.log(results[0]);
  res.render("buscar_artigos", {login: req.session.user|| null, artigos: results, palavra_chave: busca, base_imagem});
});
};
  
