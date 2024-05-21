// server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this import to handle paths correctly
const app = express();

// Import Sequelize and model setup
const sequelize = require('./models/database'); // Adjust the path according to your project structure
require('./models/relations'); // This will automatically set up relationships

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const mealsRoutes = require('./routes/meals');
const ingredientsRoutes = require('./routes/ingredients');
const shoppingListRoutes = require('./routes/shopping-list');
const mealPlanRoutes = require('./routes/meal-plans');
const uploadRoutes = require('./routes/upload'); // Add the upload route

app.use('/api/meals', mealsRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api', uploadRoutes); // Use the upload route

const PORT = process.env.PORT || 5000;

// Sync all defined models to the database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced!');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on all network interfaces at port ${PORT}`));
}).catch(err => {
    console.error('Failed to sync database or start server:', err);
});
