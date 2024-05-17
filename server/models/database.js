// models/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mealplanner.sqlite', // This is your SQLite database file
    logging: false // Turn off logging; set to console.log to enable logging
});

module.exports = sequelize;
