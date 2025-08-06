'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: uuidv4(),
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1-555-0101',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1-555-0102',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'bob.wilson@example.com',
        first_name: 'Bob',
        last_name: 'Wilson',
        phone: '+1-555-0103',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'alice.johnson@example.com',
        first_name: 'Alice',
        last_name: 'Johnson',
        phone: '+1-555-0104',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: 'charlie.brown@example.com',
        first_name: 'Charlie',
        last_name: 'Brown',
        phone: '+1-555-0105',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};