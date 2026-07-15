/**
 * Portal de Notícias - Servidor Express
 * - Configura o mecanismo de views (EJS)
 * - Habilita parsers de corpo (urlencoded/json)
 * - Define a pasta estática `public` para servir arquivos (CSS, JS, imagens)
 * - Registra rotas principais: autores, categorias, artigos e home
 */
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Carrega variáveis do .env
const session = require("express-session");
const express = require("express");
const app = express();
const routesCategorias = require("./src/routes/routesCategorias.js");
const routesArtigos = require("./src/routes/routesArtigos.js");
const routesHome = require("./src/routes/routesHome.js");
const routesUsuarios = require("./src/routes/routesUsuarios.js");
const routesCadastro = require("./src/routes/routesCadastro.js");
const routesLogin = require("./src/routes/routesLogin.js");
const path = require("path");
const port = process.env.PORT || 3000;

// Middleware para gerar nonce
app.use((req, res, next) => {
  res.locals.nonce = require("crypto").randomBytes(16).toString("hex");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Permite carregar recursos do próprio servidor por padrão
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'"], // ◄ ISSO AQUI LIBERA O SEU CSS! ('unsafe-inline' é necessário caso o EJS ou pacotes injetem estilos inline)
        fontSrc: ["'self'", "https://fonts.gstatic.com"], // Se usar Google Fonts, já deixa liberado
        imgSrc: [
          "'self'",
          "data:",
          "https://picsum.photos",
          "https://fastly.picsum.photos",
        ],
      },
    },
  }),
);
app.set("trust proxy", 1);
// Segurança: Rate Limiting para prevenir ataques de força bruta
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas tentativas de acesso. Tente novamente mais tarde.",
  });
  app.use(limiter);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "portal-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS em produção
      httpOnly: true, // Protege contra XSS
      maxAge: 24 * 60 * 60 * 1000, // Expira em 24 horas
    },
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middleware para flash messages (erros e sucessos)
app.use((req, res, next) => {
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  delete req.session.error;
  delete req.session.success;
  next();
});

// Middleware para renderizar erros como página com alert
app.use((req, res, next) => {
  res.renderError = (message, redirectUrl) => {
    req.session.error = message;
    res.redirect(redirectUrl || "/");
  };
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/categorias", routesCategorias);
app.use("/artigos", routesArtigos);
app.use("/", routesHome);
app.use("/usuarios", routesUsuarios);
app.use("/cadastro", routesCadastro);
app.use("/login", routesLogin);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
  });
}

module.exports = app;
