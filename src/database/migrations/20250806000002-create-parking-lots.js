'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parking_lots', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      openTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '00:00:00',
        field: 'open_time',
      },
      closeTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '23:59:59',
        field: 'close_time',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    });

    // Add indexes
    await queryInterface.addIndex('parking_lots', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parking_lots');
  }
};