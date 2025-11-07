const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const PORT = 3000; 

app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
    res.send('API del Congreso de TICs funcionando correctamente.');
});


app.get('/api/listado', async (req, res) => {
    const queryTerm = req.query.q ? req.query.q.toLowerCase() : null; 
    let sql = 'SELECT id, nombre, apellidos, email, twitter, ocupacion, avatar FROM participantes';
    let params = [];

    if (queryTerm) {
        sql += ' WHERE LOWER(nombre) LIKE ? OR LOWER(apellidos) LIKE ?';
        const searchPattern = `%${queryTerm}%`;
        params = [searchPattern, searchPattern];
    }

    try {
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el listado de participantes:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.get('/api/participante/:id', async (req, res) => {
    const id = parseInt(req.params.id); 
    const sql = 'SELECT id, nombre, apellidos, email, twitter, ocupacion, avatar FROM participantes WHERE id = ?';

    try {
        const [rows] = await db.query(sql, [id]);
        
        if (rows.length > 0) { 
            res.json(rows[0]);
        } else { 
            res.status(404).json({ message: 'Participante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener el participante por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/registro', async (req, res) => {
    const { nombre, apellidos, email, twitter, ocupacion, avatar, aceptaTerminos } = req.body; 

    if (!nombre || !apellidos || !email || aceptaTerminos !== true) {
        return res.status(400).json({ message: 'Error: Faltan campos obligatorios para el registro.' });
    }

    const sql = `INSERT INTO participantes (nombre, apellidos, email, twitter, ocupacion, avatar, aceptaTerminos) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [nombre, apellidos, email, twitter, ocupacion, avatar, aceptaTerminos];

    try {
        const [result] = await db.query(sql, params);
        
        res.status(201).json({ 
            id: result.insertId,
            nombre,
            apellidos,
            email,
            twitter,
            ocupacion,
            avatar
        });
    } catch (error) {
        console.error('Error al registrar participante:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo electrónico o usuario ya está registrado.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar.' });
    }
});


app.listen(PORT, () => {
    console.log(`API Iniciada con MySQL! Servidor corriendo en http://localhost:${PORT}`);
});