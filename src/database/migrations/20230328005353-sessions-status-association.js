'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("tb_sessions", {
      fields: ["status"],
      type: "foreign key",
      name: "sessions-status-association",
      references: {
        table: "tb_sessions_statuses",
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("tb_sessions", 'sessions-status-association')
  }
};
