'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_talks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(47)
      },
      chat: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sender: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      message: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      seen: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      replyTo: {
        allowNull: true,
        type: Sequelize.CHAR(22)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_talks');
  }
};