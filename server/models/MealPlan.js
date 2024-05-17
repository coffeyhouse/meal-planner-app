// models/MealPlan.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const MealPlan = sequelize.define('MealPlan', {
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
}, {
    timestamps: true
});

module.exports = MealPlan;
