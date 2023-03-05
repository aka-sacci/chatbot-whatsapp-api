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
      description: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('tb_Role', null, {});

  }
};
