/**
 * Controller Usuários
 * CRUD de usuários com hash de senha e renderização do editor.
 */
const db = require("../database/db");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);




/**
 * Cadastra um novo usuário com senha hasheada.
 * @param {import('express').Request} req - Campos: nome_usuario, email_usuario, senha_usuario, admin_usuario
 * @param {import('express').Response} res
 */
exports.cadastrarUsuario = (req,res) => {
  const nome_usuario = req.body.nome_usuario;
  const email_usuario = req.body.email_usuario;
  const hashSenha =  bcrypt.hashSync(req.body.senha_usuario, salt); 
  const admin_usuario = req.body.admin_usuario;

  db.query('INSERT INTO `portal_noticias`.`usuarios` (nome_usuario,email_usuario,senha_usuario,admin_usuario) VALUES(?,?,?,?)',
  [nome_usuario, email_usuario, hashSenha, admin_usuario], (err, results) =>{
    if (err) {
       console.error('Erro ao criar usuario:', err);
      return res.status(500).json({ error: 'Erro ao criar usuario' });
    };
     res.redirect("/usuarios/editar")
  });
}


/**
 * Atualiza dados de um usuário.
 * Observação: a senha não é re-hasheada aqui (mantém valor fornecido); considere hashear para segurança.
 * @param {import('express').Request} req - Campos: id_usuario, nome_usuario, email_usuario, senha_usuario, admin_usuario
 * @param {import('express').Response} res
 */
exports.atualizarUsuario = (req,res) => {
  nome_usuario = req.body.nome_usuario;
  email_usuario = req.body.email_usuario;
  senha_usuario = req.body.senha_usuario;
  admin_usuario = req.body.admin_usuario;
  id_usuario = req.body.id_usuario;
  db.query('UPDATE `portal_noticias`.`usuarios`SET `nome_usuario` = ?,`email_usuario` = ?,`senha_usuario` = ?, `admin_usuario` = ? WHERE `id_usuario` = ?;',
  [nome_usuario, email_usuario, senha_usuario, admin_usuario, id_usuario], (err, results) =>{
    if (err) {
       console.error('erro ao atualizar usuario', err);
      return res.status(500).json({ error: 'Erro ao atualizar usuario' });
    };
     res.redirect("/usuarios/editar")
  });
}

/**
 * Renderiza a view de editor de usuários com a lista completa.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.buscarUsuarios = (req,res) => {
 
  db.query('select * from usuarios; ',
    (err, results) => {
    if (err) {
       console.error('Erro ao buscar usuario:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuario' });
    };
     res.render("usuarios_editor", {usuarios: results})
  });
}




/**
 * Exclui um usuário pelo id.
 * @param {import('express').Request} req - req.body.id_usuario
 * @param {import('express').Response} res
 */
exports.deletarUsuario = (req,res) => {
  id_usuario = req.body.id_usuario;
  db.query('DELETE FROM `portal_noticias`.`usuarios` WHERE id_usuario = ?;',
  [id_usuario], (err, results) =>{
    if (err) {
       console.error('Erro ao deletar usuario:', err);
      return res.status(500).json({ error: 'Erro ao erro ao deletar usuario' });
    };
    res.redirect("/usuarios/editar")
  });
}



