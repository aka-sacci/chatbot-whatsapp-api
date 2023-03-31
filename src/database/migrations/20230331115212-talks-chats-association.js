'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_talks", {
      fields: ["chat"],
      type: "foreign key",
      name: "talks-chats-association",
      references: {
        table: "tb_chats",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_talks", 'talks-chats-association')
  }
};
