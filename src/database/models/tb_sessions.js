'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tb_sessions.belongsTo(models.tb_user, { foreignKey: 'user' });
      tb_sessions.hasMany(models.tb_chats_history, { foreignKey: 'session' });
      tb_sessions.belongsTo(models.tb_sessions_statuses, { foreignKey: 'status' })
    }
  }
  tb_sessions.init({
    status: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tb_sessions',
  });
  return tb_sessions;
};