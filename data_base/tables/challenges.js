const { DataTypes } = require('sequelize');
const sequelize = require('../../Insectonomy');
const GenAsp = require('./gen_asp'); 

const Challenges = sequelize.define('challenges', {
    GenAspId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Definimos GenAspId como la clave primaria
        references: {
        model: GenAsp,
        key: 'id'
        },
        allowNull: false
    },
    Vector: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Pest: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Toxins: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Allergens: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AntFact: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    InvSp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Phobia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Stigma: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

GenAsp.hasOne(Challenges, { foreignKey: 'GenAspId', as: 'challenges' });
Challenges.belongsTo(GenAsp, { foreignKey: 'GenAspId', as: 'challenges' });

module.exports = Challenges;