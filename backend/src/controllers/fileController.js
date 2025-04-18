const { extractMetadata } = require("../services/pdfService");
const Document = require("../models/Document");
const path = require("path");
const Node = require("../models/Node");
const crypto = require("crypto");
const fs = require("fs");

const hashesPath = path.join(__dirname, "../hashes.json");

// Read hashes from JSON file
function readHashes() {
  try {
    const data = fs.readFileSync(hashesPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // Return empty object if file doesn't exist
  }
}

// Write hashes to JSON file
function writeHashes(hashes) {
  fs.writeFileSync(hashesPath, JSON.stringify(hashes, null, 2));
}

// Compute file hash using streams for large files
async function computeFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Compute file hash
    const hex = await computeFileHash(req.file.path);
    const hashes = readHashes();

    // Check for duplicate
    if (hashes[hex]) {
      fs.unlinkSync(req.file.path); // Delete the uploaded file
      return res.status(400).json({ message: "Duplicate file detected." });
    }

    // Extract metadata
    const { uniqueId } = req.body;
    const metadata = await extractMetadata(req.file.path);


    // Create document in database
    const document = await Document.create({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      title: metadata.title,
      author: metadata.author,
      pages: metadata.pages,
      size: req.file.size,
      ref: uniqueId,
    });

    // Add hash to JSON after successful document creation
    hashes[hex] = true;
    writeHashes(hashes);

    // Update Node (existing code)
    const node = await Node.findOne({ where: { ref: uniqueId } });
    if (node) {
      node.filename = document.filename;
      await node.save();
    }

    res.json({ message: "File uploaded successfully", document, node });

  } catch (error) {
    console.error("Error uploading file:", error);
    // Cleanup uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ message: "Upload failed" });
  }
};

//controller to fetch documnts info from documnt model
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      order: [["uploadDate", "DESC"]], // Get newest documents first
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Error fetching documents" });
  }
};

module.exports = {
  uploadFile,
  getDocuments,
};
