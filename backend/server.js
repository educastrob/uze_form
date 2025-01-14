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

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// routes
app.post('/api/contacts', async (req, res) => {
    const { fullName, email, phone, cpf } = req.body;

    if (!validarCPF(cpf)) {
        return res.status(400).json({ message: 'CPF inválido.' });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    try {
        const cpfExistente = await pool.query('SELECT * FROM contacts WHERE cpf = $1', [cpf]);
        if (cpfExistente.rows.length > 0) {
            return res.status(400).json({ message: 'CPF já cadastrado.' });
        }

        const telefoneExistente = await pool.query('SELECT * FROM contacts WHERE phone = $1', [phone]);
        if (telefoneExistente.rows.length > 0) {
            return res.status(400).json({ message: 'Telefone já cadastrado.' });
        }

        const emailExistente = await pool.query('SELECT * FROM contacts WHERE email = $1', [email]);
        if (emailExistente.rows.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

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