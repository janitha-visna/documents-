const Document = require("../models/Document");
const Node = require("../models/Node");
const Edge = require("../models/Edge");
const sequelize = require("../config/database");

exports.saveFlow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { requestId, nodes = [], edges = [] } = req.body;
    console.log("Received requestId node :", requestId); // Should now log correctly
    // Logging nodes array details
    console.log("Received nodes array:");
    console.log(JSON.stringify(nodes, null, 2)); // Formatted JSON output
    console.log(`Number of nodes received: ${nodes.length}`);

    // Log individual node details if needed
    nodes.forEach((node, index) => {
      console.log(`Node ${index + 1}:`);
      console.log(`- ID: ${node.id}`);
      console.log(`- Type: ${node.type}`);
      console.log(`- Position: (${node.position.x}, ${node.position.y})`);
      console.log(`- Unique ID: ${node.uniqueId}`); // From your previous implementation
    });
    // Clear existing data first
    await Edge.destroy({ where: {}, transaction }); // Delete edges first
    await Node.destroy({ where: {}, transaction }); // Then delete nodes

    // Rest of your existing code
    const nodeRecords = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position_x: node.position.x,
      position_y: node.position.y,
      data: node.data,
      ref: node.ref,
    }));

    const edgeRecords = edges.map((edge) => ({
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
    }));

    await Node.bulkCreate(nodeRecords, { transaction });
    await Edge.bulkCreate(edgeRecords, { transaction });

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
