'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_Role.hasMany(models.tb_user, { foreignKey: 'role', sourceKey: 'id' });
    }
  }
  tb_Role.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'tb_Role',
    freezeTableName: true
  });
  return tb_Role;
};