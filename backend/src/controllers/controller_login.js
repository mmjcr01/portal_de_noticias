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
  const categorias = await db.getAll("categorias");
  const artigos = await db.getArtigosView();
  const artigosSemDestaque = artigos.filter(
    (artigo) => Number(artigo.destaque) === 0,
  );

  const idsCategorias = new Set(
    artigosSemDestaque.map((artigo) => String(artigo.id_categoria || "")),
  );

  return categorias.filter((categoria) =>
    idsCategorias.has(String(categoria.id_categoria || "")),
  );
};

/**
 * Lista artigos com destaque (> 0) para carrossel/área de destaque.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Array>} Artigos em destaque
 */
exports.listarArtigosDestaque = async () => {
  const artigos = await db.getArtigosView();
  return artigos.filter((artigo) => Number(artigo.destaque) > 0);
};

/**
 * Lista artigos sem destaque.
 * @returns {Promise<Array>} Artigos sem destaque
 */
exports.listarArtigos = async () => {
  const artigos = await db.getArtigosView();
  return artigos.filter((artigo) => Number(artigo.destaque) === 0);
};

/**
 * Autentica usuário via email e senha, cria sessão e redireciona para home.
 * @param {import('express').Request} req - Campos: email_usuario, senha_usuario
 * @param {import('express').Response} res
 */
exports.loginAutenticacao = async (req, res) => {
  const email_usuario = req.body.email_usuario;
  const senha_usuario = req.body.senha_usuario;

  try {
    const usuario = await db.getByField(
      "usuarios",
      "email_usuario",
      email_usuario,
    );

    if (!usuario) {
      return res.renderError(
        "Usuário não encontrado. Verifique seu email.",
        "/login",
      );
    }

    const hash = usuario.senha_usuario;
    const ismatch = await bcrypt.compare(senha_usuario, hash);

    if (!ismatch) {
      return res.renderError("Senha incorreta. Tente novamente.", "/login");
    }

    req.session.user = {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      email_usuario: usuario.email_usuario,
      admin_usuario: usuario.admin_usuario,
    };
    res.redirect("/");
  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.renderError(
      "Erro ao conectar ao servidor. Tente novamente.",
      "/login",
    );
  }
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
