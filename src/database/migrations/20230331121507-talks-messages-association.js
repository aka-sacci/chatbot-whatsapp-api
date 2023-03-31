'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_talks", {
      fields: ["message"],
      type: "foreign key",
      name: "talks-messages-association",
      references: {
        table: "tb_messages",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_talks", 'talks-messages-association')
  }
};
