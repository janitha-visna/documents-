"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("edges", {
      edge_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      target: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      animated: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("edges");
  },
};
