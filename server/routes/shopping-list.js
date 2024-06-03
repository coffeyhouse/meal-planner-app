// server/routes/shopping-list.js

const express = require('express');
const ShoppingList = require('../models/ShoppingList');
const Ingredient = require('../models/Ingredient');
const Meal = require('../models/Meal');
const MealPlanDay = require('../models/MealPlanDay');
const sequelize = require('../models/database');
const router = express.Router();

// GET /api/shopping-list/create/:mealPlanId - Create shopping list for a specific meal plan
router.get('/create/:mealPlanId', async (req, res) => {
    const { mealPlanId } = req.params;

    try {
        const mealPlanDays = await MealPlanDay.findAll({
            where: { mealPlanId },
            include: {
                model: Meal,
                include: {
                    model: Ingredient,
                    as: 'Ingredients',
                    through: {
                        attributes: ['quantity', 'unit']
                    }
                }
            }
        });

        const ingredientsNeeded = mealPlanDays.reduce((acc, day) => {
            day.Meal.Ingredients.forEach(ing => {
                if (!acc[ing.id]) {
                    acc[ing.id] = { 
                        id: ing.id,
                        name: ing.name,
                        category: ing.category,
                        quantityNeeded: 0,
                        unit: ing.MealIngredient.unit,
                        meals: [] // Initialize meals array to store meal information
                    };
                }
                acc[ing.id].quantityNeeded += parseFloat(ing.MealIngredient.quantity);
                acc[ing.id].meals.push({
                    name: day.Meal.name,
                    quantity: ing.MealIngredient.quantity
                }); // Add meal name and quantity to the meals array
            });
            return acc;
        }, {});

        const transaction = await sequelize.transaction();
        await ShoppingList.destroy({
            truncate: true,
            transaction
        });

        try {
            for (let ingId in ingredientsNeeded) {
                if (ingredientsNeeded.hasOwnProperty(ingId)) {
                    const ing = ingredientsNeeded[ingId];

                    const ingredientExists = await Ingredient.findByPk(ing.id);
                    if (!ingredientExists) {
                        throw new Error(`Ingredient with ID ${ing.id} does not exist`);
                    }

                    await ShoppingList.upsert({
                        ingredientId: ing.id,
                        quantityNeeded: ing.quantityNeeded,
                        unit: ing.unit // Ensure unit is included here
                    }, {
                        transaction
                    });
                }
            }

            await transaction.commit();

            const shoppingList = await ShoppingList.findAll({
                include: [{ model: Ingredient, attributes: ['name', 'category'] }]
            });

            // Attach meals information to the shopping list items
            const shoppingListWithMeals = shoppingList.map(item => ({
                ...item.toJSON(),
                meals: ingredientsNeeded[item.ingredientId].meals
            }));

            res.json(shoppingListWithMeals);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Failed to create shopping list:', error.message);
        res.status(500).send({ error: error.message || 'Error creating shopping list' });
    }
});

// Other routes...

module.exports = router;
