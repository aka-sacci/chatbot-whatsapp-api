'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_contacts_addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  tb_contacts_addresses.init({
    street: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    number: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    cep: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    complement: { 
      type: DataTypes.STRING,
      allowNull: true
    },
    contact: { 
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'tb_contacts_addresses',
  });
  return tb_contacts_addresses;
};