// models/MealPlanDay.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Meal = require('./Meal'); // Ensure this is correctly imported
const MealPlan = require('./MealPlan'); // Ensure this is correctly imported

const MealPlanDay = sequelize.define('MealPlanDay', {
    date: DataTypes.DATE,
    mealType: DataTypes.STRING
}, {
    timestamps: false
});

MealPlanDay.belongsTo(MealPlan, {foreignKey: 'mealPlanId'});
MealPlanDay.belongsTo(Meal, {foreignKey: 'mealId'});

module.exports = MealPlanDay;
