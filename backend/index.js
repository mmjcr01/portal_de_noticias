const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const routesAutores = require('./src/routes/routesAutores.js');
const routesCategorias = require('./src/routes/routesCategorias.js');
const routesArtigo = require('./src/routes/routesArtigo.js');
const routesHome = require('./src/routes/routesHome.js');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));



app.use('/autores', routesAutores);
app.use('/categorias', routesCategorias);
app.use('/artigos', routesArtigo);
app.use('/', routesHome);




/* app.get('/', (req, res) =>{
  res.render(routes);
}); */

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`)
});