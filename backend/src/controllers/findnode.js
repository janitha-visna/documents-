const Node = require("../models/Node");
const Document = require("../models/Document");

exports.getNodeByUniqueId = async (req, res) => {
  try {
    const { uniqueId } = req.body;
    console.log("🔵 uniqueId TYPE CHECK:", typeof uniqueId, "Value:", uniqueId);

    if (!uniqueId) {
      return res
        .status(400)
        .json({ error: "uniqueId is required in the request body" });
    }

    // 1. Find Node by ref
    const node = await Node.findOne({ where: { ref: uniqueId } });
    if (!node) {
      console.warn("⛔ No Node found with ref:", uniqueId);
      return res.status(404).json({ error: "Node not found" });
    }

    // 2. Find Document by the same ref
    const document = await Document.findOne({ where: { ref: uniqueId } });
    if (!document) {
      console.warn("⛔ No Document found with ref:", uniqueId);
      return res.status(404).json({ error: "Document not found" });
    }

    // 3. Update and save Node's filename
    node.filename = document.filename;
    await node.save();

    console.log("🔄 Updated Node:", node.toJSON());
    res.status(200).json(node);
  } catch (error) {
    console.error("🔥 Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
