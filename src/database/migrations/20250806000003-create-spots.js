'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spots', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      spotNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'spot_number',
      },
      type: {
        type: Sequelize.ENUM('compact', 'regular', 'ev'),
        allowNull: false,
        defaultValue: 'regular',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      parkingLotId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'parking_lot_id',
        references: {
          model: 'parking_lots',
          key: 'id',
        },
        onUpdate: 'CASCADE',
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
    await queryInterface.addIndex('spots', ['parking_lot_id', 'spot_number'], { unique: true });
    await queryInterface.addIndex('spots', ['type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('spots');
  }
};