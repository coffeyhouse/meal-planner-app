// models/Meal.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING, // Add this line
}, {
    timestamps: true
});

module.exports = Meal;
