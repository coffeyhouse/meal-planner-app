// routes/shopping-list.js

const express = require('express');
const ShoppingList = require('../models/ShoppingList');
const Ingredient = require('../models/Ingredient');
const MealIngredient = require('../models/MealIngredient');
const Meal = require('../models/Meal');
const router = express.Router();
const sequelize = require('../models/database');

// GET /api/shopping-list/create - Create shoppinh list
router.get('/create', async (req, res) => {
    try {
        const ingredientsNeeded = await MealIngredient.findAll({
            attributes: [
                'ingredientId',
                [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity']
            ],
            group: ['ingredientId'],
            raw: true
        });

        if (!ingredientsNeeded || ingredientsNeeded.length === 0) {
            return res.status(404).json({ message: "No ingredients found to create shopping list." });
        }

        // Start a transaction
        const transaction = await sequelize.transaction();
        await ShoppingList.destroy({
            truncate: true,
            transaction
        });

        try {
            for (let ing of ingredientsNeeded) {
                await ShoppingList.upsert({
                    ingredientId: ing.IngredientId,
                    quantityNeeded: ing.totalQuantity
                }, {
                    transaction
                });
            }

            // Commit the transaction
            await transaction.commit();

            const shoppingList = await ShoppingList.findAll({
                include: [{ model: Ingredient, attributes: ['name', 'category'] }]
            });

            res.json(shoppingList);
        } catch (error) {
            // If an error occurs, rollback the transaction
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Failed to create shopping list:', error);
        res.status(500).send({ error: error.message || 'Error creating shopping list' });
    }
});



// GET /api/shopping-list - Get the shopping list
router.get('/', async (req, res) => {
    try {
        const list = await ShoppingList.findAll({
            include: [{
                model: Ingredient,
                attributes: ['name', 'category']
            }]
        });
        res.send(list);
    } catch (error) {
        res.status(500).send(error);
    }
});

// PUT /api/shopping-list/:ingredientId - Update a shopping list item
router.put('/:ingredientId', async (req, res) => {
    try {
        const { ingredientId } = req.params;
        const [updated] = await ShoppingList.update(req.body, { where: { ingredientId } });
        if (updated) {
            const updatedItem = await ShoppingList.findByPk(ingredientId);
            res.status(200).send(updatedItem);
        } else {
            res.status(404).send("Shopping list item not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
