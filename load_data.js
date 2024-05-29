const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('./Insectonomy');
const GenAsp = require('./data_base/tables/gen_asp');
const EcoPot = require('./data_base/tables/eco_pot');
const ProdPot = require('./data_base/tables/prod_pot');
const Use = require('./data_base/tables/use');

const loadCSV = (filePath, model) => {
        console.log(`Loading data from ${filePath}`);
        fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' })) 
        .on('data', async (row) => {
            console.log(`Processing row: ${JSON.stringify(row)}`);
            try {
            const newRow = await model.create(row);
            console.log(`Inserted row: ${JSON.stringify(newRow.toJSON())}`);
            } catch (error) {
            console.error('Error inserting row:', error);
            }
        })
        .on('end', () => {
            console.log(`CSV file ${filePath} successfully processed`);
        });
    };

(async () => {
    try{
        await sequelize.sync({ force: true }); 
        loadCSV(path.join('./data_base/CSV', 'GenAsp.csv'), GenAsp);
        loadCSV(path.join('./data_base/CSV', 'Ecopot.csv'), EcoPot);
        loadCSV(path.join('./data_base/CSV', 'ProdPot.csv'), ProdPot);
        loadCSV(path.join('./data_base/CSV', 'Use.csv'), Use);
    }catch (error) {
    console.error('Error synchronizing database:', error);
    }
})();

console.log('Successfully dataload')