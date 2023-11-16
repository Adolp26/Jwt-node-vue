const express = require('express');
const routes = express.Router();
const auth = require('../middlewares/auth');

// Importações dos Controllers
const AnnotationController = require('../controllers/annotation.controller');
const PriorityController = require('../controllers/priority.controller');
const ContentController = require('../controllers/content.controller');

// Rotas para manipulação das anotações
routes.post('/annotations', auth, AnnotationController.create);
routes.delete('/annotations/:id', auth, AnnotationController.delete);
routes.get('/annotations', auth, AnnotationController.read);

// Rota Priority
routes.get('/priorities', PriorityController.read);
routes.put('/priorities/:id', PriorityController.update);

// Rota Content
routes.put('/contents/:id', ContentController.update);

module.exports = routes;
