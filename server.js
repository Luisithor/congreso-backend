const express = require('express');
const cors = require('cors');
const sql = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API del Congreso de TICs funcionando correctamente.');
});

app.get('/api/listado', async (req, res) => {
    const q = req.query.q ? req.query.q.toLowerCase() : null;

    try {
        let rows;
        if (q) {
            const search = `%${q}%`;
            rows = await sql`
                SELECT id, nombre, apellidos, email, twitter, ocupacion, avatar
                FROM participantes
                WHERE LOWER(nombre) LIKE ${search}
                    OR LOWER(apellidos) LIKE ${search}
            `;
        } else {
            rows = await sql`
                SELECT id, nombre, apellidos, email, twitter, ocupacion, avatar
                FROM participantes
            `;
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el listado:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.get('/api/participante/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await sql`
            SELECT id, nombre, apellidos, email, twitter, ocupacion, avatar
            FROM participantes
            WHERE id = ${id}
        `;

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Participante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener participante:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/registro', async (req, res) => {
    const { nombre, apellidos, email, twitter, ocupacion, avatar } = req.body;

    if (!nombre || !apellidos || !email) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const fecha_registro = new Date().toISOString(); 

    try {
        const rows = await sql`
            INSERT INTO participantes (nombre, apellidos, email, twitter, ocupacion, avatar, fecha_registro)
            VALUES (${nombre}, ${apellidos}, ${email}, ${twitter}, ${ocupacion}, ${avatar}, ${fecha_registro})
            RETURNING id
        `;

        return res.status(201).json({
            id: rows[0].id,
            nombre,
            apellidos,
            email,
            twitter,
            ocupacion,
            avatar,
            fecha_registro
        });

    } catch (error) {
        console.error('Error al registrar participante:', error);

        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo ya está registrado.' });
        }

        return res.status(500).json({ 
            message: 'Error interno al registrar.', 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`API iniciada con Neon! http://localhost:${PORT}`);
    console.log(`Conexión exitosa a Neon PostgreSQL.`);
});