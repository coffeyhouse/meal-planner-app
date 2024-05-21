// models/Meal.js
const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Author = require('./Author'); // Ensure this is correctly imported

const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    authorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Author,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Meal.belongsTo(Author, {foreignKey: 'authorId'}); // Add this line to set up the association
module.exports = Meal;
