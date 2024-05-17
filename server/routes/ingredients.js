// routes/ingredients.js

const express = require('express');
const Ingredient = require('../models/Ingredient');
const router = express.Router();

// POST /api/ingredients - Create a new ingredient
router.post('/', async (req, res) => {
    const { name, category, defaultUnit, defaultQuantity } = req.body;

    try {
        const newIngredient = await Ingredient.create({
            name,
            category,
            defaultUnit,
            defaultQuantity
        });
        res.status(201).send(newIngredient);
    } catch (error) {
        res.status(400).send(error);
    }
});


// GET /api/ingredients - Get all ingredients
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.send(ingredients);
    } catch (error) {
        res.status(500).send(error);
    }
});

// PUT /api/ingredients/:id - Update an ingredient
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Ingredient.update(req.body, { where: { id } });
        if (updated) {
            const updatedIngredient = await Ingredient.findByPk(id);
            res.status(200).send(updatedIngredient);
        } else {
            res.status(404).send("Ingredient not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// DELETE /api/ingredients/:id - Delete an ingredient
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ingredient.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send("Ingredient deleted");
        } else {
            res.status(404).send("Ingredient not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
