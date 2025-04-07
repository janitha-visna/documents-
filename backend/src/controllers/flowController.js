const Document = require("../models/Document");
const Node = require("../models/Node");
const Edge = require("../models/Edge");
const sequelize = require("../config/database");

exports.saveFlow = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { requestId, nodes = [], edges = [] } = req.body;

    // Process Nodes (existing code remains the same)
    const nodeRecords = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position_x: node.position.x,
      position_y: node.position.y,
      data: node.data,
      ref: node.ref,
    }));

    await Node.bulkCreate(nodeRecords, {
      transaction,
      updateOnDuplicate: ["position_x", "position_y"],
    });

    // Process Edges: Modified conversion
    const edgeRecords = edges.map((edge) => {
      console.log(`Original edge.id (value: ${edge.id}):`, typeof edge.id);

      // Convert "1-2" to 12 (remove hyphen and parse as integer)
      const numericId = parseInt(edge.id.replace(/-/g, ""), 10);

      console.log(`Converted edge_id:`, numericId);

      return {
        edge_id: numericId, // Use the converted numeric ID
        id: numericId, // If you want to keep both same
        type: edge.type,
        source: edge.source,
        target: edge.target,
        animated: edge.animated || false,
      };
    });

    await Edge.bulkCreate(edgeRecords, {
      transaction,
      updateOnDuplicate: ["type", "source", "target", "animated"],
    });

    await transaction.commit();
    res.status(201).json({ success: true, message: "Flow saved successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving flow:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save flow",
      error: error.message,
    });
  }
};
