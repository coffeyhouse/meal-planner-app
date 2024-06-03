// migrations/XXXXXXXXXXXXXX-add-author-id-to-meals.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Meals', 'authorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Authors', // Name of the table being referenced
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Meals', 'authorId');
  }
};
