const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

async function logoutMiddleware(req, res, next) {
    try {
        console.log('Verificando token...');
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401).json({ error: 'Token não encontrado' });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret');
        console.log('Token:', token);
        console.log('ID do usuário decodificado:', decoded._id);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        console.log('Usuário encontrado:', user)

        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Falha na verificação do token' });
    }
}

module.exports = logoutMiddleware;
