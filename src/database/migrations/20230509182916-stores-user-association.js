'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_user", {
      fields: ["store"],
      type: "foreign key",
      name: "stores-user-association",
      references: {
        table: "tb_stores",
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_user", 'stores-user-association')
  }
};
