'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats_histories", {
      fields: ["session"],
      type: "foreign key",
      name: "chats-history-session-association",
      references: {
        table: "tb_sessions",
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_chats_histories", 'chats-history-session-association')
  }
};
