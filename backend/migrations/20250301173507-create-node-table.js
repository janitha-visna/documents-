"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("nodes", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      position_x: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      position_y: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("nodes");
  },
};
