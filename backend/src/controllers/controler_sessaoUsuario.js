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
exports.artigoClicado = (id_usuario, id_artigo, id_categoria ) => {


  db.query('INSERT INTO `portal_noticias`.`sessao_usuarios` (`id_usuario`, `id_artigo`, `id_categoria`, `data_hora_acesso`) VALUES (?, ?, ?, NOW())',
    [id_usuario, id_artigo, id_categoria],
    (err, results) => {
      if (err) {
        console.error('Erro ao registrar sessão do usuário:', err); // Exibe o erro no console
        return;
      }
      console.log('Sessão registrada com sucesso:', results); // Exibe o resultado no console
    }
  );
};