'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Ingredients', 'defaultUnit', { // Make sure it's 'Ingredients'
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Ingredients', 'defaultQuantity', { // Make sure it's 'Ingredients'
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Ingredients', 'defaultUnit');
    await queryInterface.removeColumn('Ingredients', 'defaultQuantity');
  }
};
