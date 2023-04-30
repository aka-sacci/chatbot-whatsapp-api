'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_chats_statuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_chats_statuses.hasMany(models.tb_chats, { foreignKey: 'status' });
    }
  }
  tb_chats_statuses.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_chats_statuses',
  });
  return tb_chats_statuses;
};