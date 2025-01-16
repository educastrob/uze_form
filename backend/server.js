import "express-async-errors";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
const { Pool } = pg;


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

// Rota de registro
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

	console.log(name, email, password);

    if (!validarEmail(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const emailExistente = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExistente.rows.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Email ou senha incorretos.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email ou senha incorretos.' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Rota de registro de contatos
app.post('/api/contacts', authenticateToken, async (req, res) => {
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