/**
 * Controller Usuários
 * CRUD de usuários com hash de senha e renderização do editor.
 */
const db = require("../database/db");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

/**
 * Cadastra um novo usuário com senha hasheada.
 * @param {import('express').Request} req - Campos: nome_usuario, email_usuario, senha_usuario, admin_usuario
 * @param {import('express').Response} res
 */
exports.cadastrarUsuario = async (req, res) => {
  const nome_usuario = req.body.nome_usuario;
  const email_usuario = req.body.email_usuario;
  const hashSenha = bcrypt.hashSync(req.body.senha_usuario, salt);
  const admin_usuario = req.body.admin_usuario;

  try {
    await db.create(
      "usuarios",
      {
        nome_usuario,
        email_usuario,
        senha_usuario: hashSenha,
        admin_usuario,
      },
      "id_usuario",
    );

    req.session.success = "Usuário criado com sucesso!";
    res.redirect("/usuarios/editar");
  } catch (err) {
    console.error("Erro ao criar usuario:", err);
    return res.renderError(
      "Erro ao criar usuário. Este email pode já estar registrado.",
      "/usuarios/editar",
    );
  }
};

/**
 * Atualiza dados de um usuário.
 * Observação: a senha não é re-hasheada aqui (mantém valor fornecido); considere hashear para segurança.
 * @param {import('express').Request} req - Campos: id_usuario, nome_usuario, email_usuario, senha_usuario, admin_usuario
 * @param {import('express').Response} res
 */
exports.atualizarUsuario = async (req, res) => {
  const nome_usuario = req.body.nome_usuario;
  const email_usuario = req.body.email_usuario;
  const hashSenha = bcrypt.hashSync(req.body.senha_usuario, salt);
  const admin_usuario = req.body.admin_usuario;
  const id_usuario = req.body.id_usuario;

  try {
    await db.updateByField("usuarios", "id_usuario", id_usuario, {
      nome_usuario,
      email_usuario,
      senha_usuario: hashSenha,
      admin_usuario,
    });

    req.session.success = "Usuário atualizado com sucesso!";
    res.redirect("/usuarios/editar");
  } catch (err) {
    console.error("erro ao atualizar usuario", err);
    return res.renderError(
      "Erro ao atualizar usuário. Tente novamente.",
      "/usuarios/editar",
    );
  }
};

/**
 * Renderiza a view de editor de usuários com a lista completa.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.buscarUsuarios = async (req, res) => {
  try {
    const usuarios = await db.getAll("usuarios");
    res.render("usuarios_editor", { usuarios });
  } catch (err) {
    console.error("Erro ao buscar usuario:", err);
    return res.renderError(
      "Erro ao carregar usuários. Tente novamente.",
      "/usuarios/editar",
    );
  }
};

/**
 * Exclui um usuário pelo id.
 * @param {import('express').Request} req - req.body.id_usuario
 * @param {import('express').Response} res
 */
exports.deletarUsuario = async (req, res) => {
  const id_usuario = req.body.id_usuario;

  try {
    await db.deleteByField("usuarios", "id_usuario", id_usuario);
    req.session.success = "Usuário deletado com sucesso!";
    res.redirect("/usuarios/editar");
  } catch (err) {
    console.error("Erro ao deletar usuario:", err);
    return res.renderError(
      "Erro ao deletar usuário. Tente novamente.",
      "/usuarios/editar",
    );
  }
};
