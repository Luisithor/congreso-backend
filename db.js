require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false } 
});

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
