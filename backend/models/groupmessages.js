'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupMessages.belongsTo(models.Users, { foreignKey: "from" })
      GroupMessages.belongsTo(models.Groups, { foreignKey: "GroupId" })
    }
  };
  GroupMessages.init({
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'GroupMessages',
  });
  return GroupMessages;
};