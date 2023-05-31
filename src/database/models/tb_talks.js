'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_talks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_talks.belongsTo(models.tb_chats, { foreignKey: 'chat' })
      tb_talks.belongsTo(models.tb_messages_senders, { foreignKey: 'sender' })
      tb_talks.belongsTo(models.tb_messages, { foreignKey: 'message' })
    }
  }
  tb_talks.init({
    id: {
      type: DataTypes.CHAR,
      primaryKey: true
    },
    chat: DataTypes.INTEGER,
    sender: DataTypes.INTEGER,
    message: DataTypes.INTEGER,
    seen: DataTypes.BOOLEAN,
    replyTo: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'tb_talks',
  });
  return tb_talks;
};