'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_Role', [{
      id: 1,
      description: 'Administrador',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      description: 'Atendente',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      description: 'Farmacêutico',
      createdAt: new Date(),
      updatedAt: new Date()
    },], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('tb_Role', null, {});

  }
};
