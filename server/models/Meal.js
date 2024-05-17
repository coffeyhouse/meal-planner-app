// models/Meal.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING
}, {
    timestamps: true
});


module.exports = Meal;
