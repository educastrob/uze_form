const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// database config
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conexão bem-sucedida:', res.rows[0]);
    }
});

// routes
app.post('/api/contacts', async (req, res) => {
    const { fullName, email, phone, cpf } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO contacts (full_name, email, phone, cpf) VALUES ($1, $2, $3, $4) RETURNING *',
            [fullName, email, phone, cpf]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao salvar contato:', error);
        res.status(500).json({ message: 'Erro ao salvar contato.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});