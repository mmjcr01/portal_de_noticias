/**
 * Controller Home
 * Responsável por:
 * - Buscar categorias ativas com artigos sem destaque
 * - Listar artigos em destaque
 * - Calcular os mais lidos na semana (baseado em `sessao_usuarios`)
 * - Renderizar a página inicial com artigos, destaque, categorias e métricas
 * - Buscar artigos por palavra-chave
 */
const db = require("../database/db.js");

// Função para buscar categorias
/**
 * Busca categorias ativas que possuem artigos sem destaque.
 * @returns {Promise<Array>} Lista de categorias
 */
exports.buscarCategorias = async () => {
  const categorias = await db.getAll("categorias");
  const artigos = await db.getArtigosView();

  const idsCategoriasComArtigosSemDestaque = new Set(
    artigos
      .filter((artigo) => Number(artigo.destaque) === 0)
      .map((artigo) => String(artigo.id_categoria || "")),
  );

  return categorias.filter((categoria) =>
    idsCategoriasComArtigosSemDestaque.has(
      String(categoria.id_categoria || ""),
    ),
  );
};

/**
 * Lista artigos com destaque (> 0) para compor o carrossel/área de destaque da home.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Array>} Lista de artigos em destaque
 */
exports.listarArtigosDestaque = async () => {
  const artigos = await db.getArtigosView();
  return artigos.filter((artigo) => Number(artigo.destaque) > 0);
};

/**
 * Calcula os artigos mais lidos na última semana com base na tabela `sessao_usuarios`.
 * @returns {Promise<Array>} Lista dos 4 artigos mais acessados
 */
exports.maisLidosSemana = async () => {
  const sessoes = await db.getAll("sessao_usuarios");
  const artigos = await db.getArtigosView();

  const limite = 7 * 24 * 60 * 60 * 1000;
  const agora = Date.now();

  const contagem = new Map();

  sessoes.forEach((sessao) => {
    const dataAcesso = new Date(
      sessao.data_hora_acesso || sessao.data_hora_acesso || 0,
    );
    if (Number.isNaN(dataAcesso.getTime())) {
      return;
    }

    if (agora - dataAcesso.getTime() <= limite) {
      const idArtigo = String(sessao.id_artigo || "");
      contagem.set(idArtigo, (contagem.get(idArtigo) || 0) + 1);
    }
  });

  const artigosMaisLidos = artigos
    .map((artigo) => ({
      ...artigo,
      total_acessos: contagem.get(String(artigo.id_artigo || "")) || 0,
    }))
    .sort((a, b) => b.total_acessos - a.total_acessos)
    .slice(0, 4);

  return artigosMaisLidos;
};

/**
 * Renderiza a página inicial com artigos sem destaque, destaques, categorias e mais lidos.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.listarArtigos = async (req, res) => {
  const base_imagem = "/css/assets/images/";

  try {
    const artigos = await db.getArtigosView();
    const artigosSemDestaque = artigos.filter(
      (artigo) => Number(artigo.destaque) === 0,
    );
    const artigos_destaque = await exports.listarArtigosDestaque();
    const categorias = await exports.buscarCategorias();
    const artigosMaisLidos = await exports.maisLidosSemana();

    res.render("index", {
      login: req.session.user || null,
      artigos: artigosSemDestaque,
      artigos_destaque,
      artigosMaisLidos,
      categorias,
      base_imagem,
    });
  } catch (err) {
    console.error("Erro ao listar artigos ou autores:", err);
    res.status(500).json({ error: "Erro ao listar artigos ou autores" });
  }
};

/**
 * Busca artigos por categoria específica.
 * @param {import('express').Request} req - req.params.id_categoria
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.buscar_artigo_por_categoria = async (req, res) => {
  const id_categoria = req.params.id_categoria;

  try {
    const artigos = await db.getArtigosView();
    const resultados = artigos.filter(
      (artigo) => String(artigo.id_categoria || "") === String(id_categoria),
    );

    res.json(resultados);
  } catch (err) {
    console.error("Erro ao listar artigos:", err);
    res.status(500).json({ error: "Erro ao listar artigos" });
  }
};

/**
 * Busca artigos por palavra-chave no resumo.
 * @param {import('express').Request} req - req.body.busca
 * @param {import('express').Response} res
 */
exports.buscarArtigos = async (req, res) => {
  const busca = req.body.busca;
  const base_imagem = "/css/assets/images/";

  try {
    const artigos = await db.getArtigosView();
    const resultados = artigos.filter((artigo) =>
      String(artigo.resumo_artigo || "")
        .toLowerCase()
        .includes(busca.toLowerCase()),
    );

    res.render("buscar_artigos", {
      login: req.session.user || null,
      artigos: resultados,
      palavra_chave: busca,
      base_imagem,
    });
  } catch (err) {
    console.error("Erro ao listar artigos:", err);
    res.status(500).json({ error: "Erro ao listar artigos" });
  }
};
