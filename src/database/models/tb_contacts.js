'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_contacts.hasOne(models.tb_contacts_addresses, {
        foreignKey: 'contact'
      })
    }
  }
  tb_contacts.init({
    phone: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'tb_contacts',
  });
  return tb_contacts;
};