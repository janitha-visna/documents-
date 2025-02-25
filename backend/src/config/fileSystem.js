const fs = require("fs");
const path = require("path");

const ensureUploadsDirExists = () => {
  const uploadDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

module.exports = { ensureUploadsDirExists };
