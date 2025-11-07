const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost', 
  user: 'root',      
  password: 'password', 
  database: 'congreso',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
    try {
        await connection.query('SELECT 1');
        console.log('Conexión exitosa a MySQL.');
    } catch (error) {
        console.error('Error de conexión a MySQL:', error.message);
        console.log('Asegúrate de que tu servidor MySQL esté corriendo y la base de datos "congreso" exista.');
        process.exit(1); 
    }
}

testConnection();

module.exports = connection;