const Annotations = require('../models/annotation.model');


module.exports = {

    async read(req, res) {
        const priority = req.query;

        const priorityNotes = await Annotations.find(priority);

        return res.json(priorityNotes)

    },

    async update(req, res) {
        const { id } = req.params;

        try {
            const annotation = await Annotations.findById(id);

            if (!annotation) {
                return res.status(404).json({ error: "Anotação não encontrada" });
            }

            // Alternar o valor de 'priority' usando o operador de negação
            annotation.priority = !annotation.priority;

            await annotation.save();

            return res.json(annotation);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}




