'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_chats", {
      fields: ["contact"],
      type: "foreign key",
      name: "chats-contacts-association",
      references: {
        table: "tb_contacts",
        field: 'phone'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_chats", 'chats-contacts-association')
  }
};
