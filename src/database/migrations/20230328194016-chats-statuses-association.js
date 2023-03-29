'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats", {
      fields: ["status"],
      type: "foreign key",
      name: "chats-statuses-association",
      references: {
        table: "tb_chats_statuses",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_chats", 'chats-statuses-association')
  }
};
