'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get parking lots to assign spots to
    const parkingLots = await queryInterface.sequelize.query(
      'SELECT id, name FROM parking_lots ORDER BY created_at;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const spots = [];
    const spotTypes = ['regular', 'compact', 'ev'];

    parkingLots.forEach((lot, lotIndex) => {
      const spotsPerLot = [50, 80, 120, 60, 25][lotIndex] || 50;

      for (let i = 1; i <= spotsPerLot; i++) {
        const spotNumber = `${String.fromCharCode(65 + Math.floor((i - 1) / 20))}${String(i).padStart(2, '0')}`;
        
        // Assign spot types: 70% regular, 20% compact, 10% EV
        let spotType = 'regular';
        if (i % 10 === 0) spotType = 'ev';
        else if (i % 5 === 0) spotType = 'compact';

        spots.push({
          id: uuidv4(),
          spot_number: spotNumber,
          type: spotType,
          is_active: Math.random() > 0.05, // 95% of spots are active
          parking_lot_id: lot.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert('spots', spots, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('spots', null, {});
  }
};