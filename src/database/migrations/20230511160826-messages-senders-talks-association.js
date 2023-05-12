'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_talks", {
      fields: ["sender"],
      type: "foreign key",
      name: "messages-senders-talks-association",
      references: {
        table: "tb_messages_senders",
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_talks", 'messages-senders-talks-association')
  }
};
