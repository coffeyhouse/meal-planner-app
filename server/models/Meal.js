// models/Meal.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Author = require('./Author'); // Ensure this is correctly imported

const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    authorId: DataTypes.INTEGER
});

Meal.belongsTo(Author, { foreignKey: 'authorId' });

module.exports = Meal;
