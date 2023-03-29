'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_chats_statuses', [{
      id: 1,
      description: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Ended by inactivity',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      description: 'Ended by user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      description: 'Ended by contact',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      description: 'On wait',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_chats_statuses', null, {});
  }
};
