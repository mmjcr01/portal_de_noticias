/**
 * Controller Categoria
 * CRUD de categorias e renderização da view de edição.
 * Funções:
 * - listarCategorias, buscar_categoria, criar_categoria, atualizar_categoria, deletar_categoria
 */
const db = require("../database/db.js");

/**
 * Lista todas as categorias e renderiza a view de edição.
 */
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await db.getAll("categorias");
    res.render("categorias_editor", { categorias });
  } catch (err) {
    console.error("Erro ao listar categorias:", err);
    return res.renderError(
      "Erro ao carregar categorias. Tente novamente.",
      "/categorias/editar",
    );
  }
};

/**
 * Busca uma categoria por id.
 */
exports.buscar_categoria = async (req, res) => {
  try {
    const categoria = await db.getByField(
      "categorias",
      "id_categoria",
      req.params.id_categoria,
    );

    res.json(categoria || {});
  } catch (err) {
    console.error("Erro ao buscar categoria:", err);
    return res.status(500).json({ error: "Erro na consulta ao banco" });
  }
};

/**
 * Cria uma nova categoria.
 */
exports.criar_categoria = async (req, res) => {
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;

  try {
    await db.create(
      "categorias",
      {
        nome_categoria,
        descricao_categoria,
        cor_tema,
        ativo,
      },
      "id_categoria",
    );

    req.session.success = "Categoria criada com sucesso!";
    res.redirect("/categorias/editar");
  } catch (err) {
    console.error("Erro ao criar categoria:", err);
    return res.renderError(
      "Erro ao criar categoria. Tente novamente.",
      "/categorias/editar",
    );
  }
};

/**
 * Atualiza uma categoria existente.
 */
exports.atualizar_categoria = async (req, res) => {
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;
  const id_categoria = req.body.id_categoria;

  try {
    await db.updateByField("categorias", "id_categoria", id_categoria, {
      nome_categoria,
      descricao_categoria,
      cor_tema,
      ativo,
    });

    req.session.success = "Categoria atualizada com sucesso!";
    res.redirect("/categorias/editar");
  } catch (err) {
    console.error("Erro ao atualizar categoria:", err);
    return res.renderError(
      "Erro ao atualizar categoria. Tente novamente.",
      "/categorias/editar",
    );
  }
};

/**
 * Exclui uma categoria.
 */
exports.deletar_categoria = async (req, res) => {
  const id_categoria = req.body.id_categoria;

  try {
    await db.deleteByField("categorias", "id_categoria", id_categoria);
    req.session.success = "Categoria deletada com sucesso!";
    res.redirect("/categorias/editar");
  } catch (err) {
    console.error("Erro ao deletar categoria:", err);
    return res.renderError(
      "Erro ao deletar categoria. Tente novamente.",
      "/categorias/editar",
    );
  }
};
