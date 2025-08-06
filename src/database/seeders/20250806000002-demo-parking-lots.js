'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const parkingLots = [
      {
        id: uuidv4(),
        name: 'Downtown Central Parking',
        address: '123 Main Street, Downtown',
        open_time: '06:00:00',
        close_time: '23:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mall Parking Plaza',
        address: '456 Shopping Center Drive',
        open_time: '07:00:00',
        close_time: '22:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Airport Terminal Parking',
        address: '789 Airport Boulevard',
        open_time: '00:00:00',
        close_time: '23:59:59',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'University Campus Parking',
        address: '321 College Avenue',
        open_time: '05:00:00',
        close_time: '23:30:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Business District Parking',
        address: '654 Corporate Way',
        open_time: '06:30:00',
        close_time: '20:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('parking_lots', parkingLots, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parking_lots', null, {});
  }
};