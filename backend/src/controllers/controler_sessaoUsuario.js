/**
 * Controller Sessão Usuário
 * Registra cliques/acessos de usuários em artigos na tabela `sessao_usuarios`.
 */
const db = require("../database/db");

/**
 * Registra o clique/acesso do usuário em um artigo.
 * @param {number} id_usuario - Id do usuário logado
 * @param {number} id_artigo - Id do artigo acessado
 * @param {number} id_categoria - Id da categoria do artigo
 * @returns {void}
 */
exports.artigoClicado = async (id_usuario, id_artigo, id_categoria) => {
  try {
    await db.create("sessao_usuarios", {
      id_usuario,
      id_artigo,
      id_categoria,
      data_hora_acesso: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro ao registrar sessão do usuário:", err);
  }
};
