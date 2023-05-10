'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_stores', [{
      id: 1,
      description: 'Todas as lojas',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Loja 1',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('tb_stores', null, {});

  }
};
