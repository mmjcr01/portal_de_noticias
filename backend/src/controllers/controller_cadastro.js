const db = require("../database/db");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);




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



exports.Cadastro = (req,res) => {
  res.render("cadastro");
}
