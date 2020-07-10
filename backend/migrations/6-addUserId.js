'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Messages", "from", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          }
        }),
        queryInterface.addColumn("Messages", "to", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          }
        }),
        queryInterface.addColumn("GroupUsers", "UserId", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          }
        }),
        queryInterface.addColumn("GroupMessages", "from", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          }
        })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Messages", "from"),
        queryInterface.removeColumn("Messages", "to"),
        queryInterface.removeColumn("GroupUsers", "UserId"),
        queryInterface.removeColumn("GroupMessages", "from"),
      ]);
    });
  }
};
