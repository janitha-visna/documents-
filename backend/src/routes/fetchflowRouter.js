const express = require("express");
const router = express.Router();
const fetchflowController = require("../controllers/fetchflowController");

// Route to fetch nodes and edges
router.get("/flow", fetchflowController.getFlow);

module.exports = router;
