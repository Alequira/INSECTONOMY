console.log('Starting server...');

const express = require('express');
const sequelize = require('./Insectonomy');
const GenAsp = require('./data_base/tables/gen_asp');
const EcoPot = require('./data_base/tables/eco_pot');
const ProdPot = require('./data_base/tables/prod_pot');
const Use = require('./data_base/tables/use');

console.log('Modules loaded...');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoints para GenAsp
app.get('/gen_asp', async (req, res) => {
    try {
        const genAsps = await GenAsp.findAll();
        res.json(genAsps);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

app.post('/gen_asp', async (req, res) => {
    try {
        const newGenAsp = await GenAsp.create(req.body);
        res.status(201).json(newGenAsp);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el registro' });
    }
});

app.put('/gen_asp/:id', async (req, res) => {
    try {
        const [updated] = await GenAsp.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedGenAsp = await GenAsp.findOne({ where: { id: req.params.id } });
            res.status(200).json(updatedGenAsp);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

app.delete('/gen_asp/:id', async (req, res) => {
    try {
        const deleted = await GenAsp.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Endpoints para EcoPot
app.get('/eco_pot', async (req, res) => {
    try {
        const ecoPots = await EcoPot.findAll();
        res.json(ecoPots);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

app.post('/eco_pot', async (req, res) => {
    try {
        const newEcoPot = await EcoPot.create(req.body);
        res.status(201).json(newEcoPot);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el registro' });
    }
});

app.put('/eco_pot/:GenAspId', async (req, res) => {
    try {
        const [updated] = await EcoPot.update(req.body, {
            where: { GenAspId: req.params.GenAspId }
        });
        if (updated) {
            const updatedEcoPot = await EcoPot.findOne({ where: { GenAspId: req.params.GenAspId } });
            res.status(200).json(updatedEcoPot);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

app.delete('/eco_pot/:GenAspId', async (req, res) => {
    try {
        const deleted = await EcoPot.destroy({
            where: { GenAspId: req.params.GenAspId }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Endpoints para ProdPot
app.get('/prod_pot', async (req, res) => {
    try {
        const prodPots = await ProdPot.findAll();
        res.json(prodPots);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

app.post('/prod_pot', async (req, res) => {
    try {
        const newProdPot = await ProdPot.create(req.body);
        res.status(201).json(newProdPot);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el registro' });
    }
});

app.put('/prod_pot/:GenAspId', async (req, res) => {
    try {
        const [updated] = await ProdPot.update(req.body, {
            where: { GenAspId: req.params.GenAspId }
        });
        if (updated) {
            const updatedProdPot = await ProdPot.findOne({ where: { GenAspId: req.params.GenAspId } });
            res.status(200).json(updatedProdPot);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

app.delete('/prod_pot/:GenAspId', async (req, res) => {
    try {
        const deleted = await ProdPot.destroy({
            where: { GenAspId: req.params.GenAspId }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Endpoints para Use
app.get('/use', async (req, res) => {
    try {
        const uses = await Use.findAll();
        res.json(uses);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

app.post('/use', async (req, res) => {
    try {
        const newUse = await Use.create(req.body);
        res.status(201).json(newUse);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el registro' });
    }
});

app.put('/use/:GenAspId', async (req, res) => {
    try {
        const [updated] = await Use.update(req.body, {
            where: { GenAspId: req.params.GenAspId }
        });
        if (updated) {
            const updatedUse = await Use.findOne({ where: { GenAspId: req.params.GenAspId } });
            res.status(200).json(updatedUse);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

app.delete('/use/:GenAspId', async (req, res) => {
    try {
        const deleted = await Use.destroy({
            where: { GenAspId: req.params.GenAspId }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Sincroniza los modelos con la base de datos
sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Error synchronizing database:', error);
});
