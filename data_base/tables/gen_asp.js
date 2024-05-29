const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');

const GenAsp = sequelize.define('gen_asp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Or: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    Fam: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    ComNa: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    SciNa: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    BiogRe: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    BiogZo: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldBio: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldPre: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldTemp: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldAB: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldLR: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HoldAD: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    HabPat: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    LSI: {
    type: DataTypes.STRING(250),
    allowNull: false
    }

}, {
        timestamps: false 
});

module.exports = GenAsp;
