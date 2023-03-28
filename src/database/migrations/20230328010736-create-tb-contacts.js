'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_contacts', {
      phone: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(30),
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      registered: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_contacts');
  }
};