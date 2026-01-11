/**
 * Portal de Notícias - Configuração de conexão MySQL (mysql2)
 * - Cria uma conexão simples com o banco `portal_noticias`
 * - Loga status da conexão ao iniciar
 * OBS: Em produção, mova credenciais para variáveis de ambiente (.env)
 */
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  });


  connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  });

module.exports = connection;

