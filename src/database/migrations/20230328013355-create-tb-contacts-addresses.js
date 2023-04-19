'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_contacts_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      street: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      number: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      district: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      cep: {
        type: Sequelize.INTEGER(8),
        allowNull: false
      },
      complement: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      contact: {
        type: Sequelize.STRING(30),
        allowNull: false,
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
    await queryInterface.dropTable('tb_contacts_addresses');
  }
};