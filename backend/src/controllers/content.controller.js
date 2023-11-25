const Annotations = require('../models/annotation.model');

module.exports = {
    async update(req, res) {
        const { id } = req.params;
        const { notes } = req.body;

        try {
            const annotation = await Annotations.findById(id);

            if (!annotation) {
                return res.status(404).json({ error: "Anotação não encontrada" });
            }

            if (notes != undefined) {
                annotation.notes = notes;
                await annotation.save();
            }

            return res.json(annotation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
};
