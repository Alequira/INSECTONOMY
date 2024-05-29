const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');
const GenAsp = require('./gen_asp');

const ProdPot = sequelize.define('prod_pot', {
    GenAspId: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        references: {
        model: GenAsp,
        key: 'id'
        },
        allowNull: false
    },
    ManSt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManStSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManRu: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManRuSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManAg: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManAgSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManSoSt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManSoStSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManHab: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManHabSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManTer: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManTerSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManTra: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManTraSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ManFac: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ManFacSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NutFeed: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    NutFeedSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NutCost: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    NutCostSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RepSexMat: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RepSexMatSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RepNumbOff: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RepNumbOffSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RepCy: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RepCySc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RepGestInc: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RepGestIncSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RepSexInt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RepSexIntSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProPopStu: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProPopStuSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProProf: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProProfSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProLong: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProLongSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProReL: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProReLSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProOpBre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProOpBreSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProAddVal: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ProAddValSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarCultAcc: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    MarCultAccSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarPri: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    MarPriSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarCompDom: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    MarCompDomSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MarMarCha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    MarMarChaSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RegRest: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    RegRestSc: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false 
});

GenAsp.hasOne(ProdPot, { foreignKey: 'GenAspId' });
ProdPot.belongsTo(GenAsp, { foreignKey: 'GenAspId' });

module.exports = ProdPot;
