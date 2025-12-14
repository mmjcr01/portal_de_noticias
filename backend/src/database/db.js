/**
 * Portal de Notícias - Configuração de conexão MySQL (mysql2)
 * - Cria uma conexão simples com o banco `portal_noticias`
 * - Loga status da conexão ao iniciar
 * OBS: Em produção, mova credenciais para variáveis de ambiente (.env)
 */
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Michel123',
  database: "portal_noticias"});


  connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  });

module.exports = connection;

