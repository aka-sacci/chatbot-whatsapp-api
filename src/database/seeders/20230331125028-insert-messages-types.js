'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_messages_types', [{
      id: 1,
      description: 'Text',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Image',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      description: 'Audio',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      description: 'Video',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      description: 'Sticker',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_messages_types', null, {});
  }
};