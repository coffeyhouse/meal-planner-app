// routes/meals.js

const express = require('express');
const Meal = require('../models/Meal');
const MealIngredient = require('../models/MealIngredient');
const Ingredient = require('../models/Ingredient');
const Author = require('../models/Author');
const router = express.Router();

function serializeMeal(meal) {
    return {
        id: meal.id,
        name: meal.name,
        imageUrl: meal.imageUrl,
        author: meal.Author ? meal.Author.name : null,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
        ingredients: meal.Ingredients.map(ing => ({
            id: ing.id,
            name: ing.name,
            category: ing.category,
            quantity: ing.MealIngredient.quantity,
            unit: ing.MealIngredient.unit
        }))
    };
}

// POST /api/meals - Create a new meal with ingredients
router.post('/', async (req, res) => {
    const { name, ingredients, imageUrl, authorName } = req.body;

    try {
        let author = await Author.findOne({ where: { name: authorName } });
        if (!author) {
            author = await Author.create({ name: authorName });
        }

        const newMeal = await Meal.create({ name, imageUrl, authorId: author.id });

        const mealIngredients = ingredients.map(ing => ({
            MealId: newMeal.id,
            IngredientId: ing.id,
            quantity: ing.quantity,
            unit: ing.unit
        }));

        await MealIngredient.bulkCreate(mealIngredients);

        const mealWithIngredients = await Meal.findByPk(newMeal.id, {
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredients',
                    attributes: ['name', 'category'],
                    through: {
                        attributes: ['quantity', 'unit']
                    }
                },
                {
                    model: Author,
                    attributes: ['name']
                }
            ]
        });

        res.status(201).json(serializeMeal(mealWithIngredients));
    } catch (error) {
        console.error('Failed to create meal and ingredients:', error);
        res.status(400).json({ error: 'Failed to create meal' });
    }
});

// GET /api/meals - Get all meals
router.get('/', async (req, res) => {
    try {
        const meals = await Meal.findAll({
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredients',
                    attributes: ['id', 'name', 'category'],
                    through: {
                        attributes: ['quantity', 'unit']
                    }
                },
                {
                    model: Author, 
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        const result = meals.map(serializeMeal);
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
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredients',
                    attributes: ['id', 'name', 'category'],
                    through: {
                        attributes: ['quantity', 'unit']
                    }
                },
                {
                    model: Author, 
                    attributes: ['name']
                }
            ]
        });

        if (meal) {
            res.status(200).json(serializeMeal(meal));
        } else {
            res.status(404).json({ message: "Meal not found" });
        }
    } catch (error) {
        console.error('Error fetching meal details:', error);
        res.status(500).send({ error: 'Error fetching meal details' });
    }
});

// PUT /api/meals/:id - Update a meal
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl, ingredients, authorName } = req.body;

    try {
        const meal = await Meal.findByPk(id);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        let author = await Author.findOne({ where: { name: authorName } });
        if (!author) {
            author = await Author.create({ name: authorName });
        }

        meal.name = name;
        meal.imageUrl = imageUrl;
        meal.authorId = author.id;
        await meal.save();

        await MealIngredient.destroy({ where: { MealId: id } });

        const mealIngredients = ingredients.map(ing => ({
            MealId: id,
            IngredientId: ing.id,
            quantity: ing.quantity,
            unit: ing.unit
        }));
        await MealIngredient.bulkCreate(mealIngredients);

        const updatedMeal = await Meal.findByPk(id, {
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredients',
                    attributes: ['id', 'name', 'category'],
                    through: {
                        attributes: ['quantity', 'unit']
                    }
                },
                {
                    model: Author,
                    attributes: ['name']
                }
            ]
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
