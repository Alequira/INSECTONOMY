const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');
const GenAsp = require('./gen_asp'); 

const Indexes = sequelize.define('indexes', {
    GenAspId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Definimos GenAspId como la clave primaria
        references: {
        model: GenAsp,
        key: 'id'
        },
        allowNull: false
    },
    Use: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProdPot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    EcoPot: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

GenAsp.hasOne(Indexes, { foreignKey: 'GenAspId' , as: 'index'});
Indexes.belongsTo(GenAsp, { foreignKey: 'GenAspId' , as: 'index'});

module.exports = Indexes;