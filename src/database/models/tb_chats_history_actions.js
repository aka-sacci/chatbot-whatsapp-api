'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_chats_history_actions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_chats_history_actions.hasMany(models.tb_chats_history, { foreignKey: 'action' });
    }
  }
  tb_chats_history_actions.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tb_chats_history_actions',
  });
  return tb_chats_history_actions;
};