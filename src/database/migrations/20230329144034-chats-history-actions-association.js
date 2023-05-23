'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats_histories", {
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
    queryInterface.removeConstraint("tb_chats_histories", 'chats-history-actions-association')
  }
};