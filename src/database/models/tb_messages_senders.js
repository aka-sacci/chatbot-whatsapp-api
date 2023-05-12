'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_messages_senders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_messages_senders.hasMany(models.tb_talks, { foreignKey: 'sender' })
    }
  }
  tb_messages_senders.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_messages_senders',
  });
  return tb_messages_senders;
};