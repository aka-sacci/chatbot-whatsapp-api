'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_chats_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_chats_history.belongsTo(models.tb_sessions, { foreignKey: 'session' });
      tb_chats_history.belongsTo(models.tb_chats_history_actions, { foreignKey: 'action' });
      tb_chats_history.belongsTo(models.tb_chats, { foreignKey: 'chat' });
      // define association here
    }
  }
  tb_chats_history.init({
    chat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    session: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tb_chats_history',
  });
  return tb_chats_history;
};