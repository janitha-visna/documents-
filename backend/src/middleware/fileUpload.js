const upload = require("../config/multerConfig");

const handleFileUpload = upload.single("file");

module.exports = handleFileUpload;
