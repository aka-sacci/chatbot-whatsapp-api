'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_User.belongsTo(models.tb_Role, { foreignKey: 'role', targetKey: 'id' });
      tb_User.belongsTo(models.tb_stores, { foreignKey: 'store', targetKey: 'id' });

      tb_User.hasMany(models.tb_sessions, {
        foreignKey: 'user',
      });
    }
  }
  tb_User.init({
    usid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    store: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tb_user',
    freezeTableName: true
  });
  return tb_User;
};