// models/MealIngredient.js

const Meal = require('./Meal');
const Ingredient = require('./Ingredient');
const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const MealIngredient = sequelize.define('MealIngredient', {
    mealId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Meal',
        key: 'id'
      }
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Ingredient',
        key: 'id'
      }
    },
    unit: DataTypes.STRING,
    quantity: DataTypes.DECIMAL
  }, {
    timestamps: true
  });
  


// Associate directly in MealIngredient.js
Meal.hasMany(MealIngredient, {foreignKey: 'mealId'});
MealIngredient.belongsTo(Meal, {foreignKey: 'mealId'});

Ingredient.hasMany(MealIngredient, {foreignKey: 'ingredientId'});
MealIngredient.belongsTo(Ingredient, {foreignKey: 'ingredientId'});


module.exports = MealIngredient;
