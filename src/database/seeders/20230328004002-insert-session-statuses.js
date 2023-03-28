'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_sessions_statuses', [{
      id: 1,
      description: 'Valid',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Expired',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_sessions_statuses', null, {});
  }
};
