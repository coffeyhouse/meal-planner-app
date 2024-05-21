// routes/meals.js

const express = require('express');
const Meal = require('../models/Meal')
const MealIngredient = require('../models/MealIngredient')
const Ingredient = require('../models/Ingredient')
const router = express.Router();
const { Op } = require('sequelize');


function serializeMeal(meal) {
    return {
        id: meal.id,
        name: meal.name,
        imageUrl: meal.imageUrl, // Include imageUrl here
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
        ingredients: meal.Ingredients.map(ing => ({
            id: ing.id,
            name: ing.name,
            category: ing.category,
            quantity: ing.MealIngredient.quantity,
            unit: ing.MealIngredient.unit // Ensure unit is included in the serialization
        }))
    };
}



// POST /api/meals - Create a new meal with ingredients
router.post('/', async (req, res) => {
    const { name, imageUrl, ingredients } = req.body;

    try {
        // Create the new meal
        const newMeal = await Meal.create({ name, imageUrl }); // Include imageUrl here

        // Prepare the meal-ingredients associations with quantity and unit
        const mealIngredients = ingredients.map(ing => ({
            MealId: newMeal.id,
            IngredientId: ing.id,
            quantity: ing.quantity,
            unit: ing.unit // Include unit from the provided ingredient data
        }));

        // Bulk create meal ingredient associations
        await MealIngredient.bulkCreate(mealIngredients);

        // Fetch the newly created meal with its associated ingredients
        const mealWithIngredients = await Meal.findByPk(newMeal.id, {
            include: [{
                model: Ingredient,
                as: 'Ingredients',
                attributes: ['name', 'category'],
                through: {
                    attributes: ['quantity', 'unit'] // Include unit here as well
                }
            }]
        });

        // Respond with the newly created meal and its ingredients
        res.status(201).json(serializeMeal(mealWithIngredients));
    } catch (error) {
        console.error('Failed to create meal and ingredients:', error);
        res.status(400).json({ error: 'Failed to create meal' });
    }
});

// GET /api/meals - Get all meals
router.get('/', async (req, res) => {
    const queryOptions = {
        include: [{
            model: Ingredient,
            as: 'Ingredients',
            required: false,
            attributes: ['id', 'name', 'category'],
            through: {
                attributes: ['quantity', 'unit'] // Include unit if it's relevant
            }
        }],
        order: [['createdAt', 'ASC']] // Updated to use an existing column
    };

    try {
        const meals = await Meal.findAll(queryOptions);
        const result = meals.map(serializeMeal); // Ensure serializeMeal properly handles the included data
        res.json(result);
    } catch (error) {
        console.error('Error fetching meals with ingredients:', error);
        res.status(500).send(error);
    }
});

// GET /api/meals/:mealId - Get a specific meal by ID
router.get('/:mealId', async (req, res) => {
    const { mealId } = req.params;
    
    try {
        const meal = await Meal.findByPk(mealId, {
            include: [{
                model: Ingredient,
                as: 'Ingredients',
                attributes: ['id', 'name', 'category'],
                through: {
                    attributes: ['quantity', 'unit']  // Ensure 'unit' is stored in the through table
                }
            }]
        });

        if (meal) {
            res.status(200).json(serializeMeal(meal));  // Use serializeMeal to format the response
        } else {
            res.status(404).json({ message: "Meal not found" });  // Meal with the provided ID not found
        }
    } catch (error) {
        console.error('Error fetching meal details:', error);
        res.status(500).send({ error: 'Error fetching meal details' });
    }
});

// PUT /api/meals/:id - Update a meal
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl, ingredients } = req.body; // Include imageUrl here

    try {
        const meal = await Meal.findByPk(id);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        // Update the meal's name and imageUrl
        meal.name = name;
        meal.imageUrl = imageUrl; // Include imageUrl here
        await meal.save();

        // Remove all existing ingredients associated with this meal
        await MealIngredient.destroy({ where: { MealId: id } });

        // Re-add all the ingredients with new details
        const mealIngredients = ingredients.map(ing => ({
            MealId: id,
            IngredientId: ing.id,
            quantity: ing.quantity,
            unit: ing.unit
        }));
        await MealIngredient.bulkCreate(mealIngredients);

        // Fetch the updated meal with its ingredients to return
        const updatedMeal = await Meal.findByPk(id, {
            include: [{
                model: Ingredient,
                as: 'Ingredients',
                attributes: ['id', 'name', 'category'],
                through: {
                    attributes: ['quantity', 'unit']
                }
            }]
        });

        res.status(200).json(serializeMeal(updatedMeal));
    } catch (error) {
        console.error('Failed to update meal and ingredients:', error);
        res.status(500).json({ error: 'Failed to update meal' });
    }
});

// DELETE /api/meals/:id - Delete a meal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Meal.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send("Meal deleted");
        } else {
            res.status(404).send("Meal not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
