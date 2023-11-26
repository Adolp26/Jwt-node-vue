const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

async function logoutMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);
        console.log("Erro no logoutMiddleware")

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}

module.exports = logoutMiddleware;
