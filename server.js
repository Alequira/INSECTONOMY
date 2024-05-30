console.log('Starting server...');

const express = require('express');
const { Op } = require('sequelize');
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
    DissVector: EcoPot,
    DissPest: EcoPot,


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
    LegLeg: Use

    // Agrega todas las columnas de todas las tablas aquí
};


app.post('/search', async (req, res) => {
    const { categories } = req.body;
    const searchCriteria = {};

    for (const [key, value] of Object.entries(categories)) {
        if (value) {
            searchCriteria[key] = { [Op.eq]: value };
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

        // Realizar las búsquedas en paralelo y agrupar resultados por GenAspId
        const resultsMap = new Map();

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

        // Obtener registros completos de GenAsp y sus asociaciones
        const finalResults = await Promise.all(Array.from(resultsMap.keys()).map(async primaryKey => {
            return await GenAsp.findByPk(primaryKey, {
                include: [
                    { model: EcoPot, as: 'eco_pot', required: false },
                    { model: ProdPot, as: 'prod_pot', required: false },
                    { model: Use, as: 'use', required: false },
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
                        (result.index && result.index[key] !== undefined);
            });
        });

        // Extraer los IDs de los insectos que coinciden con todas las búsquedas
        const insectIds = filteredResults.map(result => result.id);

        // Crear un texto con los IDs de los insectos
        const idsText = `IDs de insectos que coinciden con todas las búsquedas: ${insectIds.join(', ')}`;

        // Extraer datos para la gráfica de índices
        const indexData = filteredResults.map(result => ({
            id: result.id,
            use: result.index ? result.index.Use : null,
            prodPot: result.index ? result.index.ProdPot : null
        }));

        // Responder con los resultados filtrados, el texto con los IDs y los datos de la gráfica
        res.json({results: filteredResults , idsText, indexData});
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