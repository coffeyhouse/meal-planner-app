// routes/meal-plans.js

const express = require('express');
const Meal = require('../models/Meal');
const MealPlan = require('../models/MealPlan');
const MealPlanDay = require('../models/MealPlanDay');
const router = express.Router();

// POST /api/meal-plans - Create a new meal plan
router.post('/', async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const newMealPlan = await MealPlan.create({
            startDate,
            endDate
        });
        res.status(201).json(newMealPlan);
    } catch (error) {
        console.error('Failed to create meal plan:', error);
        res.status(500).json({ error: 'Failed to create meal plan' });
    }
});


// GET /api/meal-plans/:id - Get a specific meal plan by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const mealPlan = await MealPlan.findByPk(id, {
            include: [{
                model: MealPlanDay,
                include: [Meal] // Ensure Meal is associated in MealPlanDay model
            }]
        });

        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        res.status(200).json(mealPlan);
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).send({ error: 'Error fetching meal plan' });
    }
});

// GET /api/meal-plans - List all meal plans
router.get('/', async (req, res) => {
    try {
        const mealPlans = await MealPlan.findAll({
            include: [{
                model: MealPlanDay,
                include: [Meal] // This will include details of meals for each day
            }]
        });
        res.status(200).json(mealPlans);
    } catch (error) {
        console.error('Error listing meal plans:', error);
        res.status(500).json({ error: 'Error listing meal plans' });
    }
});

// POST /api/meal-plans/:mealPlanId/meals - Add a meal to a specific day in a meal plan
router.post('/:mealPlanId/meals', async (req, res) => {
    const { mealPlanId } = req.params;
    const { date, mealId, mealType } = req.body;

    try {
        const mealPlan = await MealPlan.findByPk(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        const newMealPlanDay = await MealPlanDay.create({
            mealPlanId,
            date,
            mealId,
            mealType
        });

        res.status(201).json(newMealPlanDay);
    } catch (error) {
        console.error('Failed to add meal to meal plan:', error);
        res.status(500).json({ error: 'Failed to add meal to meal plan' });
    }
});


module.exports = router;