const express = require("express");
const { uploadFile,getDocuments } = require("../controllers/fileController");
const handleFileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.post("/upload", handleFileUpload, uploadFile);

router.get("/upload", getDocuments);

module.exports = router;
