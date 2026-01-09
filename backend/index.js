/**
 * Portal de Notícias - Servidor Express
 * - Configura o mecanismo de views (EJS)
 * - Habilita parsers de corpo (urlencoded/json)
 * - Define a pasta estática `public` para servir arquivos (CSS, JS, imagens)
 * - Registra rotas principais: autores, categorias, artigos e home
 */
const helmet = require("helmet");
const rateLimit = require("express-rate-limit")
require('dotenv').config();  // Carrega variáveis do .env
const session = require("express-session")
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const routesAutores = require('./src/routes/routesAutores.js');
const routesCategorias = require('./src/routes/routesCategorias.js');
const routesArtigos = require('./src/routes/routesArtigos.js');
const routesHome = require('./src/routes/routesHome.js');
const routesUsuarios = require("./src/routes/routesUsuarios.js");
const routesCadastro = require("./src/routes/routesCadastro.js");
const routesLogin = require('./src/routes/routesLogin.js');
const port = process.env.PORT;

// Segurança: Helmet para proteger contra vulnerabilidades comuns
app.use(helmet());

// Segurança: Rate Limiting para prevenir ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,  // Limita a 100 requisições por IP
  message: 'Muitas tentativas de acesso. Tente novamente mais tarde.'
});
app.use(limiter);


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS em produção
    httpOnly: true,  // Protege contra XSS
    maxAge: 24 * 60 * 60 * 1000  // Expira em 24 horas
  }
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/autores', routesAutores);
app.use('/categorias', routesCategorias);
app.use('/artigos', routesArtigos);
app.use('/', routesHome);
app.use('/usuarios',routesUsuarios);
app.use('/cadastro',routesCadastro);
app.use('/login',routesLogin);




app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`)
});