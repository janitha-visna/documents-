const { extractMetadata } = require("../services/pdfService");
const Document = require("../models/Document");
const path = require("path");

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Extract metadata from the uploaded PDF
    const metadata = await extractMetadata(req.file.path);
    
    // Save file details and metadata to the database
    const document = await Document.create({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      title: metadata.title,
      author: metadata.author,
      pages: metadata.pages,
      size: req.file.size,
    });

    res.json({
      message: "File uploaded and metadata saved successfully",
      document,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Failed to upload file and save metadata" });
  }
};

module.exports = { uploadFile };
