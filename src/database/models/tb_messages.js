'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_messages.hasOne(models.tb_talks, { foreignKey: 'message' })
      tb_messages.belongsTo(models.tb_messages_types, { foreignKey: 'type' })
    }
  }
  tb_messages.init({
    type: DataTypes.INTEGER,
    content: DataTypes.STRING,
    filename: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_messages',
  });
  return tb_messages;
};