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
exports.listarCategorias = (req, res) => {
  db.query("SELECT * FROM categorias", (err, results) => {
    if (err) {
      console.error("Erro ao listar categorias:", err);
      return res.renderError(
        "Erro ao carregar categorias. Tente novamente.",
        "/categorias/editar",
      );
    }
    res.render("categorias_editor", { categorias: results });
  });
};

/**
 * Busca uma categoria por id.
 */
exports.buscar_categoria = (req, res) => {
  db.query(
    "SELECT * FROM categorias WHERE id_categoria = ?",
    [req.params.id_categoria],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro na consulta ao banco" });
      }
      res.json(results);
    },
  );
};

/**
 * Cria uma nova categoria.
 */
exports.criar_categoria = (req, res) => {
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;

  db.query(
    "INSERT INTO `portal_noticias`.`categorias` (`nome_categoria`,`descricao_categoria`,`cor_tema`,`ativo`) VALUES(?,?,?,?)",
    [nome_categoria, descricao_categoria, cor_tema, ativo],
    (err, results) => {
      if (err) {
        console.error("Erro ao criar categoria:", err);
        return res.renderError(
          "Erro ao criar categoria. Tente novamente.",
          "/categorias/editar",
        );
      }
      req.session.success = "Categoria criada com sucesso!";
      res.redirect("/categorias/editar");
    },
  );
};

/**
 * Atualiza uma categoria existente.
 */
exports.atualizar_categoria = (req, res) => {
  const nome_categoria = req.body.nome_categoria;
  const descricao_categoria = req.body.descricao_categoria;
  const cor_tema = req.body.cor_tema;
  const ativo = req.body.ativo;
  const id_categoria = req.body.id_categoria;

  db.query(
    "UPDATE categorias SET nome_categoria = ?, descricao_categoria = ?, cor_tema = ?, ativo = ? WHERE id_categoria = ?",
    [nome_categoria, descricao_categoria, cor_tema, ativo, id_categoria],
    (err, results) => {
      if (err) {
        console.error("Erro ao atualizar categoria:", err);
        return res.renderError(
          "Erro ao atualizar categoria. Tente novamente.",
          "/categorias/editar",
        );
      }
      req.session.success = "Categoria atualizada com sucesso!";
      res.redirect("/categorias/editar");
    },
  );
};

/**
 * Exclui uma categoria.
 */
exports.deletar_categoria = (req, res) => {
  const id_categoria = req.body.id_categoria;

  db.query(
    "DELETE FROM categorias WHERE id_categoria = ?",
    [id_categoria],
    (err, results) => {
      if (err) {
        console.error("Erro ao deletar categoria:", err);
        return res.renderError(
          "Erro ao deletar categoria. Tente novamente.",
          "/categorias/editar",
        );
      }
      req.session.success = "Categoria deletada com sucesso!";
      res.redirect("/categorias/editar");
    },
  );
};
