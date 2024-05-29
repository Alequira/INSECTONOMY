const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');
const GenAsp = require('./gen_asp');

const Use = sequelize.define('use', {
    GenAspId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Definimos GenAspId como la clave primaria
        references: {
        model: GenAsp,
        key: 'id'
        },
        allowNull: false
    },
    MaUSubs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MaUSelCons: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MaUCom: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseFo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseFe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseBioconv: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseBiocont: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUsePol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUsePet: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseCult: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SoUseOth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ObtHar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ObtSHar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ObtPro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtNA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtCA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtSA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtAs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtEu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtOc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ContUtAf: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarYN: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarLoc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarReg: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarNat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarInt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarMP: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ScLS: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ScMS: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ScLaS: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccCSA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccNA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccAf: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccOc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccEu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SocAccAs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    LegPunc: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    LegLeg: {
        type: DataTypes.STRING, // Sin límite de longitud
        allowNull: false
    }
}, {
    timestamps: false 
});

GenAsp.hasOne(Use, { foreignKey: 'GenAspId' , as: 'use'});
Use.belongsTo(GenAsp, { foreignKey: 'GenAspId', as: 'use' });

module.exports = Use;
