'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_chats.hasMany(models.tb_chats_history, { foreignKey: 'chat' });
      tb_chats.belongsTo(models.tb_chats_statuses, { foreignKey: 'status' });
      tb_chats.belongsTo(models.tb_contacts, { foreignKey: 'contact' })
      tb_chats.hasMany(models.tb_talks, { foreignKey: 'chat' })
    }
  }
  tb_chats.init({
    contact: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_chats',
  });
  return tb_chats;
};