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
      // define association here
    }
  }
  tb_talks.init({
    chat: DataTypes.INTEGER,
    message: DataTypes.INTEGER,
    seen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tb_talks',
  });
  return tb_talks;
};