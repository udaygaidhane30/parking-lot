'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'start_time',
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'end_time',
      },
      status: {
        type: Sequelize.ENUM('active', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'active',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      spotId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'spot_id',
        references: {
          model: 'spots',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('reservations', ['spot_id', 'start_time', 'end_time']);
    await queryInterface.addIndex('reservations', ['user_id', 'start_time']);
    await queryInterface.addIndex('reservations', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
  }
};