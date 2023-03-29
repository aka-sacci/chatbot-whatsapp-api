'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_chats_history_actions', [{
      id: 1,
      description: 'Started',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Tranfered',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      description: 'Ended',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_chats_history_actions', null, {});
  }
};
