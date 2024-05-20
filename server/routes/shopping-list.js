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

        // Simplified logging to avoid circular references
        console.log("mealPlanDays IDs:", mealPlanDays.map(day => ({
            id: day.id,
            mealId: day.mealId,
            ingredients: day.Meal.Ingredients.map(ing => ing.id)
        })));

        const ingredientsNeeded = mealPlanDays.reduce((acc, day) => {
            day.Meal.Ingredients.forEach(ing => {
                if (!acc[ing.id]) {
                    acc[ing.id] = { 
                        id: ing.id,
                        name: ing.name,
                        category: ing.category,
                        quantityNeeded: 0 
                    };
                }
                acc[ing.id].quantityNeeded += parseFloat(ing.MealIngredient.quantity);
            });
            return acc;
        }, {});

        // Log the constructed ingredientsNeeded object without circular references
        console.log("ingredientsNeeded IDs:", Object.keys(ingredientsNeeded));

        const transaction = await sequelize.transaction();
        await ShoppingList.destroy({
            truncate: true,
            transaction
        });

        try {
            for (let ingId in ingredientsNeeded) {
                if (ingredientsNeeded.hasOwnProperty(ingId)) {
                    const ing = ingredientsNeeded[ingId];

                    // Additional logging to ensure ing.id is correctly accessed
                    console.log("Ingredient object:", ing);
                    console.log("Checking ingredient with ID:", ing.id);

                    // Validate if ingredientId exists in the Ingredients table
                    const ingredientExists = await Ingredient.findByPk(ing.id);
                    if (!ingredientExists) {
                        throw new Error(`Ingredient with ID ${ing.id} does not exist`);
                    }

                    await ShoppingList.upsert({
                        ingredientId: ing.id,
                        quantityNeeded: ing.quantityNeeded,
                    }, {
                        transaction
                    });
                }
            }

            await transaction.commit();

            const shoppingList = await ShoppingList.findAll({
                include: [{ model: Ingredient, attributes: ['name', 'category'] }]
            });

            res.json(shoppingList);
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
