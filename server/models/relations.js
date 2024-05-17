// models/relations.js

const Meal = require('./Meal');
const Ingredient = require('./Ingredient');
const MealIngredient = require('./MealIngredient');
const ShoppingList = require('./ShoppingList');
const MealPlan = require('./MealPlan');
const MealPlanDay = require('./MealPlanDay');

// Define relationships
Meal.belongsToMany(Ingredient, { through: MealIngredient, as: 'Ingredients' });
Ingredient.belongsToMany(Meal, { through: MealIngredient, as: 'Meals' });

Ingredient.hasOne(ShoppingList, { foreignKey: 'ingredientId' });
ShoppingList.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

MealPlan.hasMany(MealPlanDay, {foreignKey: 'mealPlanId'});
Meal.hasMany(MealPlanDay, {foreignKey: 'mealId'});