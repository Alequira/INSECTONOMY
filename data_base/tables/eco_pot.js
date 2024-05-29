const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');
const GenAsp = require('./gen_asp'); 

const EcoPot = sequelize.define('eco_pot', {
    GenAspId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Definimos GenAspId como la clave primaria
        references: {
        model: GenAsp,
        key: 'id'
        },
        allowNull: false
    },
    CultCultIdDi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CultInspArt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CultEdu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CultRecEcot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CultSpiReg: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RegBioind: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RegBiocont: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RegPol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RegSeed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SupNutCy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SupSoIm: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProFF: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProWildF: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProBiomol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProBiopro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProBiom: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProBiomimi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DissVector: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DissPest: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

GenAsp.hasOne(EcoPot, { foreignKey: 'GenAspId', as: 'eco_pot' });
EcoPot.belongsTo(GenAsp, { foreignKey: 'GenAspId', as: 'eco_pot' });

module.exports = EcoPot;
