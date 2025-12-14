/**
 * Portal de Notícias - Servidor Express
 * - Configura o mecanismo de views (EJS)
 * - Habilita parsers de corpo (urlencoded/json)
 * - Define a pasta estática `public` para servir arquivos (CSS, JS, imagens)
 * - Registra rotas principais: autores, categorias, artigos e home
 */
const session = require("express-session")
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const routesAutores = require('./src/routes/routesAutores.js');
const routesCategorias = require('./src/routes/routesCategorias.js');
const routesArtigos = require('./src/routes/routesArtigos.js');
const routesHome = require('./src/routes/routesHome.js');
const routesUsuarios = require("./src/routes/routesUsuarios.js");
const routesCadastro = require("./src/routes/routesCadastro.js");
const routesLogin = require('./src/routes/routesLogin.js');


app.use(session({
  secret: "chave-secreta", // use algo mais forte depois
  resave: false,
  saveUninitialized: false
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