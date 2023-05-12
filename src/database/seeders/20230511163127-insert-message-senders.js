'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_messages_senders', [{
      id: 1,
      description: 'Atendente',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      description: 'Contato',
      createdAt: new Date(),
      updatedAt: new Date()
    },], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_messages_senders', null, {});
  }
};
