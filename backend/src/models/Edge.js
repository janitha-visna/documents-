const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Edge = sequelize.define(
  "Edge",
  {
    edge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: DataTypes.STRING, // Now a regular field
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "edges", // Ensure lowercase table name
    timestamps: true, // Enable automatic handling of createdAt and updatedAt
  }
);

module.exports = Edge;
