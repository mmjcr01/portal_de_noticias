const db = require("../database/db");

exports.artigoClicado = (id_usuario, id_artigo, id_categoria ) => {


  console.log("chegou");
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