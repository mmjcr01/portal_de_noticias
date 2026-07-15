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

const fallbackArtigos = [
  {
    id_artigo: "fallback_destaque_1",
    titulo_artigo: "TechNews destaca as principais novidades da semana",
    resumo_artigo:
      "Confira os destaques da semana em tecnologia, cultura e economia.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home1/800/500",
    alt_imagem: "Resumo da homepage",
    nome_categoria: "Tecnologia",
    destaque: 1,
  },
  {
    id_artigo: "fallback_destaque_2",
    titulo_artigo:
      "Campanha de capacitação digital cresce entre pequenos negócios",
    resumo_artigo:
      "Pequenos negócios reforçam presença digital com ferramentas acessíveis.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home2/800/500",
    alt_imagem: "Pessoa trabalhando com notebook",
    nome_categoria: "Economia",
    destaque: 2,
  },
  {
    id_artigo: "fallback_destaque_3",
    titulo_artigo: "Festival local reúne público nas principais cidades",
    resumo_artigo:
      "A programação ganha destaque com atrações regionais e shows gratuitos.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home3/800/500",
    alt_imagem: "Festival ao ar livre",
    nome_categoria: "Cultura",
    destaque: 2,
  },
];

const fallbackCategorias = [
  {
    id_categoria: "fallback_cat_tech",
    nome_categoria: "Tecnologia",
    ativo: true,
  },
  {
    id_categoria: "fallback_cat_economia",
    nome_categoria: "Economia",
    ativo: true,
  },
  {
    id_categoria: "fallback_cat_cultura",
    nome_categoria: "Cultura",
    ativo: true,
  },
];

const fallbackMaisLidos = [
  {
    id_artigo: "fallback_destaque_1",
    resumo_artigo:
      "Confira os destaques da semana em tecnologia, cultura e economia.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home1/800/500",
    alt_imagem: "Resumo da homepage",
    nome_categoria: "Tecnologia",
    total_acessos: 12,
  },
];

const temDadosHome = (artigos) => Array.isArray(artigos) && artigos.length > 0;

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
    const artigos = (await db.getArtigosView()) || [];
    const artigosSemDestaque = temDadosHome(artigos)
      ? artigos.filter((artigo) => Number(artigo.destaque) === 0)
      : fallbackArtigos.filter((artigo) => Number(artigo.destaque) === 0);
    const artigos_destaque = temDadosHome(artigos)
      ? await exports.listarArtigosDestaque()
      : fallbackArtigos.filter((artigo) => Number(artigo.destaque) > 0);
    const categorias = temDadosHome(artigos)
      ? await exports.buscarCategorias()
      : fallbackCategorias;
    const artigosMaisLidos = temDadosHome(artigos)
      ? await exports.maisLidosSemana()
      : fallbackMaisLidos;

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
