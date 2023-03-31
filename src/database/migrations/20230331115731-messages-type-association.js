'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_messages", {
      fields: ["type"],
      type: "foreign key",
      name: "messages-type-association",
      references: {
        table: "tb_messages_types",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_messages", 'messages-type-association')
  }
};
