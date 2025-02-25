const express = require("express");
const { uploadFile } = require("../controllers/fileController");
const handleFileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.post("/upload", handleFileUpload, uploadFile);

module.exports = router;
