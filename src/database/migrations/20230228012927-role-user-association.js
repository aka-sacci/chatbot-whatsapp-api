'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_user", {
      fields: ["role"],
      type: "foreign key",
      name: "role-user-association",
      references: {
        table: "tb_Role",
        field: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_user", 'role-user-association')
  }
};
