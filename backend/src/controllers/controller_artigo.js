/**
 * Controller Artigo
 * Responsável por CRUD de artigos e upload de imagem de destaque.
 * Upload:
 * - Configura `multer` com storage em `/public/css/assets/images`
 * - Gera nome de arquivo seguro baseado no nome original + timestamp
 * Exporta:
 * - uploadArquivo: instância do multer para uso nas rotas (ex.: uploadArquivo.single('campo'))
 */
const db = require("../database/db.js");
const multer = require("multer");
const path = require("path");
const sessaoUsuarioController = require("./controler_sessaoUsuario.js");

const fallbackArtigos = [
  {
    id_artigo: "fallback_destaque_1",
    titulo_artigo: "TechNews destaca as principais novidades da semana",
    resumo_artigo:
      "Confira os destaques da semana em tecnologia, cultura e economia.",
    conteudo_artigo:
      "Esta página de fallback foi exibida porque a consulta ao banco de dados não retornou o artigo solicitado em produção.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home1/800/500",
    alt_imagem: "Resumo da homepage",
    id_categoria: "fallback_cat_tech",
    id_usuario: "fallback_user_001",
    data_publicacao: "2026-07-15",
    destaque: 1,
  },
  {
    id_artigo: "fallback_destaque_2",
    titulo_artigo:
      "Campanha de capacitação digital cresce entre pequenos negócios",
    resumo_artigo:
      "Pequenos negócios reforçam presença digital com ferramentas acessíveis.",
    conteudo_artigo:
      "Este artigo de fallback garante que o usuário consiga abrir a página mesmo quando a base de dados não respondeu.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home2/800/500",
    alt_imagem: "Pessoa trabalhando com notebook",
    id_categoria: "fallback_cat_economia",
    id_usuario: "fallback_user_001",
    data_publicacao: "2026-07-14",
    destaque: 2,
  },
  {
    id_artigo: "fallback_destaque_3",
    titulo_artigo: "Festival local reúne público nas principais cidades",
    resumo_artigo:
      "A programação ganha destaque com atrações regionais e shows gratuitos.",
    conteudo_artigo:
      "A rota do artigo continua funcionando com conteúdo de reserva até que a base de dados fique disponível novamente.",
    imagem_destaque_artigo: "https://picsum.photos/seed/home3/800/500",
    alt_imagem: "Festival ao ar livre",
    id_categoria: "fallback_cat_cultura",
    id_usuario: "fallback_user_001",
    data_publicacao: "2026-07-13",
    destaque: 2,
  },
];

const fallbackCategorias = {
  fallback_cat_tech: { nome_categoria: "Tecnologia" },
  fallback_cat_economia: { nome_categoria: "Economia" },
  fallback_cat_cultura: { nome_categoria: "Cultura" },
};

const fallbackUsuarios = {
  fallback_user_001: { nome_usuario: "Equipe TechNews" },
};

const buscarArtigoFallback = (id_artigo) => {
  return (
    fallbackArtigos.find((artigo) => artigo.id_artigo === id_artigo) ||
    fallbackArtigos[0]
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/css/assets/images"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    const baseName = path
      .basename(file.originalname, ext)
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "") // remove caracteres especiais
      .replace(/[^a-zA-Z0-9-_]/g, "_") // troca espaços e símbolos por "_"
      .toLowerCase();

    // Gera algo como: artigo-1729962945920.png
    const nomeSeguro = `${baseName}-${Date.now()}${ext}`;

    cb(null, nomeSeguro);
  },
});

/**
 * Instância do multer com storage configurado.
 * Use nas rotas: uploadArquivo.single('imagem_destaque_artigo')
 */
const uploadArquivo = multer({ storage });
exports.uploadArquivo = uploadArquivo;

// Função para buscar categorias
/**
 * Lista todas as categorias ordenadas por nome.
 * @returns {Promise<Array>} categorias
 */
exports.buscarCategorias = async () => {
  return db.getAll("categorias");
};

// Função para buscar autores
/**
 * Lista todos os autores.
 * @returns {Promise<Array>} autores
 */
exports.buscarUsuarios = async () => {
  return db.getAll("usuarios");
};

// Função para listar artigos
/**
 * Renderiza o editor de artigos com lista de artigos, autores e categorias.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.listarArtigos = async (req, res) => {
  const base_imagem = "/css/assets/images/";

  try {
    const artigos = await db.getArtigosView();
    const usuarios = await exports.buscarUsuarios();
    const categorias = await exports.buscarCategorias();

    res.render("artigos_editor", {
      artigos,
      usuarios,
      categorias,
      base_imagem,
    });
  } catch (err) {
    console.error("Erro ao listar artigos ou autores:", err);
    res.renderError(
      "Erro ao carregar artigos. Tente novamente.",
      "/artigos/editar",
    );
  }
};

/**
 * Exibe a página de um artigo específico e registra acesso do usuário (se logado).
 * @param {import('express').Request} req - req.params.id_artigo
 * @param {import('express').Response} res
 */
exports.buscar_artigo = async (req, res) => {
  const id_artigo = req.params.id_artigo;
  const base_imagem = "/css/assets/images/";
  const login = req.session.user;

  try {
    let artigo = await db.getByField("artigos", "id_artigo", id_artigo);

    if (!artigo) {
      artigo = buscarArtigoFallback(id_artigo);
    }

    if (login) {
      const id_usuario = login.id_usuario;
      const id_categoria = artigo.id_categoria;
      sessaoUsuarioController.artigoClicado(
        id_usuario,
        id_artigo,
        id_categoria,
      );
    }

    res.render("artigo", {
      login: login || null,
      artigo: {
        ...artigo,
        nome_categoria:
          fallbackCategorias[artigo.id_categoria]?.nome_categoria || "",
        nome_usuario: fallbackUsuarios[artigo.id_usuario]?.nome_usuario || "",
      },
      base_imagem,
    });
  } catch (err) {
    console.error("Erro ao buscar artigo:", err);
    return res.status(500).json({ error: "Erro na consulta ao banco" });
  }
};

/**
 * Cria um novo artigo.
 * @param {import('express').Request} req - req.file.filename (imagem), campos do body
 * @param {import('express').Response} res
 */
exports.criar_artigo = async (req, res) => {
  const titulo_artigo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;
  const resumo_artigo = req.body.resumo_artigo;
  const alt_imagem = req.body.alt_imagem || "Imagem do artigo";
  const data_publicacao = req.body.data_publicacao || null;
  const id_categoria = req.body.id_categoria;
  const id_usuario = req.body.id_usuario || "1";
  const destaque = req.body.destaque || 0;
  const imagem_destaque_artigo = req.file
    ? req.file.filename
    : req.body.imagem_destaque_artigo;

  try {
    await db.create(
      "artigos",
      {
        titulo_artigo,
        resumo_artigo,
        conteudo_artigo,
        alt_imagem,
        id_categoria,
        id_usuario,
        data_publicacao,
        destaque,
        imagem_destaque_artigo,
      },
      "id_artigo",
    );

    req.session.success = "Artigo criado com sucesso!";
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao criar artigo:", err);
    return res.renderError(
      "Erro ao criar artigo. Verifique os dados e tente novamente.",
      "/",
    );
  }
};

/**
 * Atualiza um artigo existente.
 * @param {import('express').Request} req - req.file.filename (opcional), body inclui id_artigo
 * @param {import('express').Response} res
 */
exports.atualizar_artigo = async (req, res) => {
  const id_artigo = req.body.id_artigo;
  const titulo_artigo = req.body.titulo_artigo;
  const conteudo_artigo = req.body.conteudo_artigo;
  const resumo_artigo = req.body.resumo_artigo;
  const alt_imagem = req.body.alt_imagem;
  const data_publicacao = req.body.data_publicacao;
  const id_categoria = req.body.id_categoria;
  const id_autor = req.body.id_autor;
  const destaque = req.body.destaque;
  const imagem_destaque_artigo = req.file
    ? req.file.filename
    : req.body.imagem_destaque_artigo;

  try {
    await db.updateByField("artigos", "id_artigo", id_artigo, {
      titulo_artigo,
      resumo_artigo,
      conteudo_artigo,
      alt_imagem,
      id_categoria,
      id_autor,
      data_publicacao,
      destaque,
      imagem_destaque_artigo,
    });

    req.session.success = "Artigo atualizado com sucesso!";
    res.redirect("/artigos/editar");
  } catch (err) {
    console.error("Erro ao atualizar artigo:", err);
    return res.renderError(
      "Erro ao atualizar artigo. Tente novamente.",
      "/artigos/editar",
    );
  }
};

/**
 * Deleta um artigo.
 * @param {import('express').Request} req - req.body.id_artigo
 * @param {import('express').Response} res
 */
exports.deletar_artigo = async (req, res) => {
  const id = req.body.id_artigo;

  try {
    await db.deleteByField("artigos", "id_artigo", id);
    req.session.success = "Artigo deletado com sucesso!";
    res.redirect("/artigos/editar");
  } catch (err) {
    console.error("Erro ao deletar artigo:", err);
    return res.renderError(
      "Erro ao deletar artigo. Tente novamente.",
      "/artigos/editar",
    );
  }
};

/**
 * Renderiza a view de cadastro de artigo.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.cadastro = async (req, res) => {
  const categorias = await exports.buscarCategorias();
  res.render("cadastro_artigo", {
    categorias,
    login: req.session.user,
  });
};
