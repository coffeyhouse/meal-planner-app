// routes/meal-plans.js

const express = require('express');
const Meal = require('../models/Meal');
const MealPlan = require('../models/MealPlan');
const MealPlanDay = require('../models/MealPlanDay');
const Author = require('../models/Author');
const router = express.Router();
const { Op } = require('sequelize');

// Helper function to transform the meal object
function transformMeal(meal) {
    return {
        id: meal.id,
        name: meal.name,
        imageUrl: meal.imageUrl,
        author: meal.Author ? meal.Author.name : null,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
        authorId: meal.authorId
    };
}

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
            include: [
                {
                    model: MealPlanDay,
                    include: [
                        {
                            model: Meal,
                            include: [
                                {
                                    model: Author,
                                    attributes: ['name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        // Transform the mealPlan to include author name directly in the meal object
        const transformedMealPlan = {
            ...mealPlan.toJSON(),
            MealPlanDays: mealPlan.MealPlanDays.map(mealPlanDay => ({
                ...mealPlanDay.toJSON(),
                Meal: transformMeal(mealPlanDay.Meal)
            }))
        };

        res.status(200).json(transformedMealPlan);
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

// POST /api/meal-plans/:mealPlanId/meals - Add or update a meal to a specific day in a meal plan
router.post('/:mealPlanId/meals', async (req, res) => {
    const { mealPlanId } = req.params;
    const { date, mealId, mealType } = req.body;

    try {
        const mealPlan = await MealPlan.findByPk(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        // Normalize date to ensure comparison is done correctly
        const normalizedDate = new Date(date).toISOString().split('T')[0];

        console.log(`Checking for existing MealPlanDay with mealPlanId: ${mealPlanId}, date: ${normalizedDate}, mealType: ${mealType}`);

        // Find all entries with the same mealPlanId, date, and mealType
        const existingMealPlanDays = await MealPlanDay.findAll({
            where: {
                mealPlanId,
                mealType,
                date: {
                    [Op.eq]: new Date(normalizedDate)
                }
            }
        });

        if (existingMealPlanDays.length > 0) {
            console.log(`Found existing MealPlanDays: ${existingMealPlanDays.map(d => d.id).join(', ')}`);
            // Update the first existing meal
            const mealPlanDay = existingMealPlanDays[0];
            mealPlanDay.mealId = mealId;
            await mealPlanDay.save();
            console.log(`Updated existing MealPlanDay with id: ${mealPlanDay.id}`);

            // Delete the rest of the existing meals
            const remainingMealPlanDays = existingMealPlanDays.slice(1);
            await Promise.all(remainingMealPlanDays.map(day => day.destroy()));
            console.log(`Deleted remaining MealPlanDays: ${remainingMealPlanDays.map(d => d.id).join(', ')}`);
            res.status(200).json(mealPlanDay); // Ensure response is sent here
        } else {
            // Create a new meal
            const newMealPlanDay = await MealPlanDay.create({
                mealPlanId,
                date,
                mealId,
                mealType
            });
            console.log(`Created new MealPlanDay with id: ${newMealPlanDay.id}`);
            res.status(201).json(newMealPlanDay);
        }
    } catch (error) {
        console.error('Failed to add or update meal to meal plan:', error);
        res.status(500).json({ error: 'Failed to add or update meal to meal plan' });
    }
});

// POST /api/meal-plans/:mealPlanId/meals/delete - Delete a meal from a specific day in a meal plan
router.post('/:mealPlanId/meals/delete', async (req, res) => {
    const { mealPlanId } = req.params;
    const { date, mealType } = req.body;

    try {
        const mealPlan = await MealPlan.findByPk(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({ message: "Meal plan not found" });
        }

        // Normalize date to ensure comparison is done correctly
        const normalizedDate = new Date(date).toISOString().split('T')[0];

        console.log(`Checking for existing MealPlanDay with mealPlanId: ${mealPlanId}, date: ${normalizedDate}, mealType: ${mealType}`);

        // Find all entries with the same mealPlanId, date, and mealType
        const existingMealPlanDays = await MealPlanDay.findAll({
            where: {
                mealPlanId,
                mealType,
                date: {
                    [Op.eq]: new Date(normalizedDate)
                }
            }
        });

        if (existingMealPlanDays.length > 0) {
            console.log(`Found existing MealPlanDays: ${existingMealPlanDays.map(d => d.id).join(', ')}`);
            // Delete all the existing meals
            await Promise.all(existingMealPlanDays.map(day => day.destroy()));
            console.log(`Deleted MealPlanDays: ${existingMealPlanDays.map(d => d.id).join(', ')}`);
        }

        res.status(200).json({ message: 'Meal deleted from meal plan' });
    } catch (error) {
        console.error('Failed to delete meal from meal plan:', error);
        res.status(500).json({ error: 'Failed to delete meal from meal plan' });
    }
});


module.exports = router;
