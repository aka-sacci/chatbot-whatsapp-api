'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_messages_types', [{
      id: 1,
      description: 'chat',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'image',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      description: 'audio',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      description: 'video',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      description: 'sticker',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      description: 'ptt',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      description: 'reply',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      description: 'document',
      createdAt: new Date(),
      updatedAt: new Date()
    },], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_messages_types', null, {});
  }
};