'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tb_user', [{
      usid: 'admin',
      password: '$2a$12$BD8jHVO9vo5eB1Zdzcy2geNplELbRoHd.4Ye7fvD.2UZZZYQ.pS8G',
      name: 'Administrador Default',
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_user', null, {});
  }
};
