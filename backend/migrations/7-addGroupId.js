'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("GroupMessages", "GroupId", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id"
          }
        }),
        queryInterface.addColumn("GroupUsers", "GroupId", {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Groups",
            key: "id"
          }
        }),
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("GroupMessages", "GroupId"),
        queryInterface.removeColumn("GroupUsers", "GroupId"),
      ]);
    });
  }
};
