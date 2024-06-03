'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Disable foreign key checks
        await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF');

        // Check if 'createdAt' column exists
        const tableDefinition = await queryInterface.describeTable('Authors');
        if (!tableDefinition.createdAt) {
            // Add the 'createdAt' column
            await queryInterface.addColumn('Authors', 'createdAt', {
                type: Sequelize.DATE,
                allowNull: true
            });
        }

        if (!tableDefinition.updatedAt) {
            // Add the 'updatedAt' column
            await queryInterface.addColumn('Authors', 'updatedAt', {
                type: Sequelize.DATE,
                allowNull: true
            });
        }

        // Update the columns to set the default values if they were just added
        if (!tableDefinition.createdAt || !tableDefinition.updatedAt) {
            await queryInterface.sequelize.query(`
                UPDATE Authors
                SET createdAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP
            `);
        }

        // Change the columns to disallow NULL and set the default value
        if (!tableDefinition.createdAt) {
            await queryInterface.changeColumn('Authors', 'createdAt', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            });
        }
        
        if (!tableDefinition.updatedAt) {
            await queryInterface.changeColumn('Authors', 'updatedAt', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            });
        }

        // Re-enable foreign key checks
        await queryInterface.sequelize.query('PRAGMA foreign_keys = ON');
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable('Authors');
        if (tableDefinition.createdAt) {
            await queryInterface.removeColumn('Authors', 'createdAt');
        }
        if (tableDefinition.updatedAt) {
            await queryInterface.removeColumn('Authors', 'updatedAt');
        }
    }
};
