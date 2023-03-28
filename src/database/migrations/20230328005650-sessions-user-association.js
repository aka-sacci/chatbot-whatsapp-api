'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_sessions", {
      fields: ["user"],
      type: "foreign key",
      name: "sessions-user-association",
      references: {
        table: "tb_User",
        field: 'usid'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_sessions", 'sessions-user-association')
  }
};
