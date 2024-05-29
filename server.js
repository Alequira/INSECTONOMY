console.log('Starting server...');

const express = require('express');
const sequelize = require('./Insectonomy');
const GenAsp = require('./data_base/tables/gen_asp');
const EcoPot = require('./data_base/tables/eco_pot');
const ProdPot = require('./data_base/tables/prod_pot');
const Use = require('./data_base/tables/use');
const Indexes = require('./data_base/tables/indexes');

console.log('Modules loaded...');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoint para búsqueda por categorías
app.post('/search', async (req, res) => {
    const { categories } = req.body;
    try {
        const results = await GenAsp.findAll({
            where: categories,
            include: [
                { model: EcoPot },
                { model: ProdPot },
                { model: Use },
                { model: Indexes}
            ]
        });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
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
