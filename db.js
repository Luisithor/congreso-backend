require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    await sql`SELECT 1`;
    console.log("Conexión exitosa a Neon PostgreSQL.");
  } catch (error) {
    console.error("Error de conexión a Neon:", error);
    process.exit(1);
  }
})();

module.exports = sql;
