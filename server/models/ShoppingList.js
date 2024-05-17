// models/ShoppingList.js

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const ShoppingList = sequelize.define('ShoppingList', {
    ingredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true,  // Ensure this is set if you want to use 'ON CONFLICT'
        unique: true,
        allowNull: false
    },
    quantityNeeded: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantityPurchased: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    purchaseStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
}, {
    timestamps: false
});


module.exports = ShoppingList;
