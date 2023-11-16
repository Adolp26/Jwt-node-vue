const Annotations = require("../models/annotation.model");
//const authenticateToken = require('../middlewares/auth');

module.exports = {
    async read(req, res) {
        try {
            console.log("Chamando a função read");
            const annotationList = await Annotations.find({ user: req.user._id });

            return res.json(annotationList);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Ocorreu um erro ao buscar as anotações." });
        }
    },

    async create(req, res) {
        const { title, notes, priority } = req.body;

        if (!notes || !title || !req.user || !req.user._id) {
            return res.status(400).json({
                error: "Dados inválidos ou usuário não autenticado corretamente.",
            });
        }

        const annotationsCreated = await Annotations.create({
            title,
            notes,
            priority,
            user: req.user._id,
        });

        return res.json(annotationsCreated);
    },


    async delete(req, res) {
        const { id } = req.params;

        const annotationDeleted = await Annotations.findOneAndDelete({ _id: id, user: req.user._id });

        if (annotationDeleted) {
            return res.json(annotationDeleted);
        }

        return res.status(401).json({ error: "Não foi encontrado o registro para deletar" });
    },

    // Adicione a linha abaixo se desejar proteger esta rota com autenticação
    // read: authenticateToken,
};
