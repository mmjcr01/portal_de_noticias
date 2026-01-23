const db = require("../database/db");
/**
 * Controller Login
 * Autenticação de usuários:
 * - Busca artigos (auxiliar)
 * - Autenticação com bcrypt
 * - Criação de sessão do usuário
 * - Renderização de login e logout
 */
const bcrypt = require("bcrypt");

/**
 * Busca categorias ativas que possuem artigos sem destaque.
 * @returns {Promise<Array>} Lista de categorias
 */
exports.buscarCategorias = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      "select distinct c.id_categoria, c.nome_categoria, c.descricao_categoria, c.cor_tema, c.ativo from categorias as c, artigos as a where c.id_categoria = a.id_categoria and a.destaque = 0;",
      (err, results) => {
        if (err) {
          console.error("Erro ao listar categorias:", err);
          return reject(err);
        }
        resolve(results);
      },
    );
  });
};

/**
 * Lista artigos com destaque (> 0) para carrossel/área de destaque.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Array>} Artigos em destaque
 */
exports.listarArtigosDestaque = async (req, res) => {
  const base_imagem = "/css/assets/images/";
  try {
    const artigos_destaque = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM vw_artigos where destaque > 0 order by nome_categoria",
        (err, results) => {
          if (err) {
            console.error("Erro ao listar artigos:", err);
            return reject(err);
          }
          resolve(results);
        },
      );
    });

    return artigos_destaque; // Retorna os dados corretamente
  } catch (err) {
    console.error("Erro ao listar artigos ou autores:", err);
    throw err; // Lança o erro para ser tratado na função chamadora
  }
};

/**
 * Lista artigos sem destaque.
 * @returns {Promise<Array>} Artigos sem destaque
 */
exports.listarArtigos = async () => {
  try {
    // Buscar artigos sem destaque
    const artigos = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM vw_artigos where destaque = 0 order by nome_categoria;",
        (err, results) => {
          if (err) {
            console.error("Erro ao listar artigos:", err);
            return reject(err);
          }
          resolve(results);
        },
      );
    });

    return artigos;
  } catch (err) {
    console.error("Erro ao listar artigos ou autores:", err);
    return { error: "Erro ao listar artigos ou autores" };
  }
};

/**
 * Autentica usuário via email e senha, cria sessão e redireciona para home.
 * @param {import('express').Request} req - Campos: email_usuario, senha_usuario
 * @param {import('express').Response} res
 */
exports.loginAutenticacao = (req, res) => {
  const email_usuario = req.body.email_usuario;
  const senha_usuario = req.body.senha_usuario;
  const base_imagem = "/css/assets/images/";

  db.query(
    "select * from usuarios where email_usuario = ?",
    [email_usuario],
    (err, results) => {
      if (err) {
        console.error("Erro no servidor:", err);
        return res.renderError(
          "Erro ao conectar ao servidor. Tente novamente.",
          "/login",
        );
      }
      if (!results || results.length === 0) {
        return res.renderError(
          "Usuário não encontrado. Verifique seu email.",
          "/login",
        );
      }

      const hash = results[0].senha_usuario;
      // Usando callback do bcrypt
      bcrypt.compare(senha_usuario, hash, (err, ismatch) => {
        if (err) {
          console.error("Erro ao comparar senhas:", err);
          return res.renderError(
            "Erro ao autenticar. Tente novamente.",
            "/login",
          );
        }
        if (!ismatch) {
          return res.renderError("Senha incorreta. Tente novamente.", "/login");
        }

        // Só se a senha estiver correta
        req.session.user = {
          id_usuario: results[0].id_usuario,
          nome_usuario: results[0].nome_usuario,
          email_usuario: results[0].email_usuario,
          admin_usuario: results[0].admin_usuario,
        };
        res.redirect("/");
      });
    },
  );
};

/**
 * Renderiza a página de login.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.login = (req, res) => {
  res.render("login");
};

/**
 * Faz logout destruindo a sessão e redireciona para home.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
};
