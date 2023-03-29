'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats_history", {
      fields: ["action"],
      type: "foreign key",
      name: "chats-history-actions-association",
      references: {
        table: "tb_chats_history_actions",
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_chats_history", 'chats-history-actions-association')
  }
};