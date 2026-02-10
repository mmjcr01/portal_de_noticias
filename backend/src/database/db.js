/**
 * Portal de Notícias - Configuração de conexão PostgreSQL (Supabase)
 * - Usa URL de conexão completa
 * - Cria pool de conexões para melhor performance
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Conectado ao banco de dados Supabase com sucesso!");
});

pool.on("error", (err) => {
  console.error("Erro na conexão com o banco de dados:", err);
});

// Para compatibilidade com código existente, exportamos pool
module.exports = pool;
