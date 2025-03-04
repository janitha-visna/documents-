const express = require("express");
const flowController = require("../controllers/flowController");

const router = express.Router();

router.post("/save", flowController.saveFlow);

module.exports = router;
