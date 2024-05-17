// models/Ingredient.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Ingredient = sequelize.define('Ingredient', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    defaultUnit: { type: DataTypes.STRING },  
    defaultQuantity: { type: DataTypes.INTEGER }
});

module.exports = Ingredient;
