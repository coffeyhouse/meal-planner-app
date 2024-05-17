'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MealIngredients', {
      mealId: {
        type: Sequelize.INTEGER,
        references: { model: 'Meals', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
      },
      ingredientId: {
        type: Sequelize.INTEGER,
        references: { model: 'Ingredients', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      primaryKey: Sequelize.literal('PRIMARY KEY (mealId, ingredientId)')
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MealIngredients');
  }
};
