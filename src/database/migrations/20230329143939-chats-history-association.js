'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats_history", {
      fields: ["chat"],
      type: "foreign key",
      name: "chats-history-association",
      references: {
        table: "tb_chats",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_chats_history", 'chats-history-association')
  }
};
