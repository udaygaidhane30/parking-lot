'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get users and spots
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users ORDER BY created_at;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const spots = await queryInterface.sequelize.query(
      'SELECT id FROM spots WHERE is_active = true ORDER BY created_at LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || spots.length === 0) {
      console.log('No users or spots found to create reservations');
      return;
    }

    const reservations = [];
    const statuses = ['active', 'completed', 'cancelled'];
    
    // Create some past reservations (completed)
    for (let i = 0; i < 8; i++) {
      const user = users[i % users.length];
      const spot = spots[i % spots.length];
      const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - daysAgo);
      startTime.setHours(8 + (i % 8), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + (1 + Math.floor(Math.random() * 4))); // 1-4 hours

      reservations.push({
        id: uuidv4(),
        start_time: startTime,
        end_time: endTime,
        status: 'completed',
        user_id: user.id,
        spot_id: spot.id,
        created_at: new Date(startTime.getTime() - 86400000), // Created 1 day before start
        updated_at: new Date(),
      });
    }

    // Create some future reservations (active)
    for (let i = 0; i < 12; i++) {
      const user = users[i % users.length];
      const spot = spots[(i + 8) % spots.length]; // Use different spots
      const daysFromNow = Math.floor(Math.random() * 14) + 1; // 1-14 days from now
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + daysFromNow);
      startTime.setHours(9 + (i % 12), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + (1 + Math.floor(Math.random() * 3))); // 1-3 hours

      reservations.push({
        id: uuidv4(),
        start_time: startTime,
        end_time: endTime,
        status: 'active',
        user_id: user.id,
        spot_id: spot.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Create a few cancelled reservations
    for (let i = 0; i < 3; i++) {
      const user = users[i % users.length];
      const spot = spots[(i + 16) % spots.length];
      const daysFromNow = Math.floor(Math.random() * 7) + 1; // 1-7 days from now
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + daysFromNow);
      startTime.setHours(14 + (i * 2), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 2);

      reservations.push({
        id: uuidv4(),
        start_time: startTime,
        end_time: endTime,
        status: 'cancelled',
        user_id: user.id,
        spot_id: spot.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('reservations', reservations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservations', null, {});
  }
};