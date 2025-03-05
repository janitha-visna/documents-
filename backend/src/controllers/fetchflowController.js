const Node = require("../models/Node");
const Edge = require("../models/Edge");

exports.getFlow = async (req, res) => {
  try {
    // Fetch all nodes and edges from the database
    const nodes = await Node.findAll();
    const edges = await Edge.findAll();

    // Send the response with the fetched data
    res.status(200).json({
      success: true,
      message: "Flow data fetched successfully",
      data: {
        nodes,
        edges,
      },
    });
  } catch (error) {
    console.error("Error fetching flow data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch flow data",
      error: error.message,
    });
  }
};
