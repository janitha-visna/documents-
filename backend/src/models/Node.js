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
    filename: {
      type: DataTypes.STRING,
      allowNull: true, // Explicitly allow NULL (default is true)
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ref: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "nodes", // Ensure lowercase table name
    timestamps: true, // Enable automatic handling of createdAt and updatedAt
  }
);

module.exports = Node;
