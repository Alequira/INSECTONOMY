console.log('Starting server...');

const express = require('express');
const path = require('path');
const { Op } = require('sequelize');
const sequelize = require('./Insectonomy');
const GenAsp = require('./data_base/tables/gen_asp');
const EcoPot = require('./data_base/tables/eco_pot');
const ProdPot = require('./data_base/tables/prod_pot');
const Use = require('./data_base/tables/use');
const Challenges = require('./data_base/tables/challenges');
const Indexes = require('./data_base/tables/indexes');

console.log('Modules loaded...');

const app = express();
// Puerto de escucha
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Middleware para manejar URLs sin extensión .html
app.use((req, res, next) => {
    if (!req.path.endsWith('.html') && !req.path.includes('.')) {
        const filePath = path.join(__dirname, 'public', `${req.path}.html`);
        res.sendFile(filePath, (err) => {
            if (err) {
                next(); // Si no se encuentra el archivo, sigue con el siguiente middleware
            }
        });
    } else {
        next();
    }
});


// Diccionario para mapear columnas a sus respectivas tablas
const columnTableMap = {

    Or: GenAsp,
    Fam: GenAsp,
    ComNa: GenAsp,
    SciNa: GenAsp,
    BiogRe: GenAsp,
    BiogZo: GenAsp,
    HoldBio: GenAsp,
    HoldPre: GenAsp,
    HoldTemp: GenAsp,
    HoldAB: GenAsp,
    HoldLR: GenAsp,
    HoldAD: GenAsp,
    HabPat: GenAsp,
    LSI: GenAsp,


    CultCultIdDi: EcoPot,
    CultInspArt: EcoPot,
    CultEdu: EcoPot,
    CultRecEcot: EcoPot,
    CultSpiReg: EcoPot,
    RegBioind: EcoPot,
    RegBiocont: EcoPot,
    RegPol: EcoPot,
    RegSeed: EcoPot,
    SupNutCy: EcoPot,
    SupSoIm: EcoPot,
    ProFF: EcoPot,
    ProWildF: EcoPot,
    ProBiomol: EcoPot,
    ProBiopro: EcoPot,
    ProBiom: EcoPot,
    ProBiomimi: EcoPot,


    ManSt: ProdPot,
    ManRu: ProdPot,
    ManAg: ProdPot,
    ManSoSt: ProdPot,
    ManHab: ProdPot,
    ManTer: ProdPot,
    ManTra: ProdPot,
    ManFac: ProdPot,
    NutFeed: ProdPot,
    NutCost: ProdPot,
    RepSexMat: ProdPot,
    RepNumbOff: ProdPot,
    RepCy: ProdPot,
    RepGestInc: ProdPot,
    RepSexInt: ProdPot,
    ProPopStu: ProdPot,
    ProProf: ProdPot,
    ProLong: ProdPot,
    ProReL: ProdPot,
    ProOpBre: ProdPot,
    ProAddVal: ProdPot,
    MarCultAcc: ProdPot,
    MarPri: ProdPot,
    MarCompDom: ProdPot,
    MarMarCha: ProdPot,
    RegRest: ProdPot,


    MaUSubs: Use,
    MaUSelCons: Use,
    MaUCom: Use,
    SoUseFo: Use,
    SoUseFe: Use,
    SoUseBioconv: Use,
    SoUseBiocont: Use,
    SoUsePol: Use,
    SoUsePet: Use,
    SoUseCult: Use,
    SoUseOth: Use,
    ObtHar: Use,
    ObtSHar: Use,
    ObtPro: Use,
    ContUtNA: Use,
    ContUtCA: Use,
    ContUtSA: Use,
    ContUtAs: Use,
    ContUtEu: Use,
    ContUtOc: Use,
    ContUtAf: Use,
    MarYN: Use,
    MarLoc: Use,
    MarReg: Use,
    MarNat: Use,
    MarInt: Use,
    MarMP: Use,
    ScLS: Use,
    ScMS: Use,
    ScLaS: Use,
    SocAccCSA: Use,
    SocAccNA: Use,
    SocAccAf: Use,
    SocAccOc: Use,
    SocAccEu: Use,
    SocAccAs: Use,
    LegPunc: Use,
    LegLeg: Use,

    Vector: Challenges,
    Pest: Challenges,
    Toxins: Challenges,
    Allergens: Challenges,
    AntFact: Challenges,
    InvSp: Challenges,
    Phobia: Challenges,
    Stigma: Challenges,

    /* Use: Indexes,
    ProdPot: Indexes,
    EcoPot: Indexes,
    Challenges: Indexes,
    Average: Indexes, */

};


app.post('/search', async (req, res) => {
    const { categories } = req.body;
    const searchCriteria = {};

    // Construir criterios de búsqueda solo si hay categorías
    if (Object.keys(categories).length > 0) {
        for (const [key, value] of Object.entries(categories)) {
            if (value) {
                searchCriteria[key] = { [Op.eq]: value };
            }
        }
    }

    try {
        // Mapear las búsquedas por tabla
        const tableSearches = {};
        for (const [key, value] of Object.entries(searchCriteria)) {
            const table = columnTableMap[key];
            if (table) {
                if (!tableSearches[table.name]) {
                    tableSearches[table.name] = [];
                }
                tableSearches[table.name].push({ [key]: value });
            }
        }

        // Si no hay criterios, hacer búsqueda completa en GenAsp
        const resultsMap = new Map();
        if (Object.keys(searchCriteria).length === 0) {
            // Buscar todos los registros de GenAsp y sus relaciones
            const allGenAspRecords = await GenAsp.findAll({
                include: [
                    { model: EcoPot, as: 'eco_pot', required: false },
                    { model: ProdPot, as: 'prod_pot', required: false },
                    { model: Use, as: 'use', required: false },
                    { model: Challenges, as: 'challenges', required: false },
                    { model: Indexes, as: 'index', required: false }
                ]
            });

            allGenAspRecords.forEach(record => {
                resultsMap.set(record.id, record);
            });
        } else {
            // Búsqueda filtrada por cada tabla basada en criterios
            for (const [tableName, conditions] of Object.entries(tableSearches)) {
                const table = require(`./data_base/tables/${tableName}`);
                const whereClause = conditions.reduce((acc, condition) => {
                    return { ...acc, ...condition };
                }, {});
                const results = await table.findAll({ where: whereClause });

                results.forEach(record => {
                    const primaryKey = record.GenAspId || record.id;
                    if (!resultsMap.has(primaryKey)) {
                        resultsMap.set(primaryKey, {});
                    }
                    const tableName = record.constructor.name;
                    resultsMap.get(primaryKey)[tableName] = record;
                });
            }
        }

        // Convertir resultsMap en un array de registros completos
        const finalResults = await Promise.all(Array.from(resultsMap.keys()).map(async primaryKey => {
            return await GenAsp.findByPk(primaryKey, {
                include: [
                    { model: EcoPot, as: 'eco_pot', required: false },
                    { model: ProdPot, as: 'prod_pot', required: false },
                    { model: Use, as: 'use', required: false },
                    { model: Challenges, as: 'challenges', required: false },
                    { model: Indexes, as: 'index', required: false }
                ]
            });
        }));

        // Filtrar resultados que no cumplen con todas las condiciones
        const filteredResults = finalResults.filter(result => {
            return Object.keys(searchCriteria).every(key => {
                return result[key] !== undefined || 
                        (result.eco_pot && result.eco_pot[key] !== undefined) ||
                        (result.prod_pot && result.prod_pot[key] !== undefined) ||
                        (result.use && result.use[key] !== undefined) ||
                        (result.challenges && result.challenges[key] !== undefined)||
                        (result.indexes && result.indexes[key] !== undefined);
            });
        });

        // Extraer datos para el cliente
        const insectIds = filteredResults.map(result => result.id);
        const idsText = `Insect IDs matching all searches: ${insectIds.join(', ')}`;
        const indexData = filteredResults.map(result => ({
            id: result.id,
            ...result.toJSON(),
            ...(result.eco_pot ? result.eco_pot.toJSON() : {}),
            ...(result.prod_pot ? result.prod_pot.toJSON() : {}),
            ...(result.use ? result.use.toJSON() : {}),
            ...(result.challenges ? result.challenges.toJSON() : {}),
            ...(result.index ? result.index.toJSON() : {})
        }));

        // Log de depuración
        console.log("Index Data:", indexData);

        // Enviar respuesta al cliente
        res.json({ results: filteredResults, idsText, indexData });
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
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