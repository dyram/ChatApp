'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Messages.belongsTo(models.Users, { foreignKey: "from" })
      Messages.belongsTo(models.Users, { foreignKey: "to" })
    }
  };
  Messages.init({
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};