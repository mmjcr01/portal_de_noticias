/**
 * Controller Cadastro
 * Cadastro de usuários:
 * - Hash de senha com bcrypt
 * - Inserção em `usuarios`
 * - Renderização da view de login após cadastro
 */
const db = require("../database/db");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);




/**
 * Cadastra um novo usuário e renderiza a página de login.
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
     res.render("login");
  });
}


/**
 * Renderiza a página de cadastro de usuário.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.Cadastro = (req,res) => {
  res.render("cadastro");
}
