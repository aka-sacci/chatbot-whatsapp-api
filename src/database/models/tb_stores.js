'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_stores.hasMany(models.tb_user, { foreignKey: 'store', sourceKey: 'id' });
    }
  }
  tb_stores.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tb_stores',
    freezeTableName: true
  });
  return tb_stores;
};