'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_contacts_addresses", {
      fields: ["contact"],
      type: "foreign key",
      name: "contacts-addresses-association",
      references: {
        table: "tb_contacts",
        field: 'phone'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_contacts_addresses", 'contacts-addresses-association')
  }
};
