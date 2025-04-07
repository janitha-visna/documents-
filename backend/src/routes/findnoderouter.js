const express = require("express");
const router = express.Router();
const fileController = require("../controllers/findnode");

// Update Node filename
router.post("/nodes/", fileController.getNodeByUniqueId);

module.exports = router;
