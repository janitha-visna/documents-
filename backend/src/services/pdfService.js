const fs = require("fs");
const pdf = require("pdf-parse");

const extractMetadata = async (filepath) => {
  const dataBuffer = fs.readFileSync(filepath);
  const data = await pdf(dataBuffer);

  return {
    title: data.info.Title || "Untitled",
    author: data.info.Author || "Unknown",
    pages: data.numpages,
  };
};

module.exports = { extractMetadata };
