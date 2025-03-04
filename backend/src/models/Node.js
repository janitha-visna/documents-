const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Node = sequelize.define(
  "Node",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position_x: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    position_y: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "nodes", // Ensure lowercase table name
    timestamps: true, // Enable automatic handling of createdAt and updatedAt
  }
);

module.exports = Node;
