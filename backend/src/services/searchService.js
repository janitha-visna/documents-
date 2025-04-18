const { Document } = require("flexsearch");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

class SearchService {
  constructor() {
    this.documents = [];
    this.index = new Document({
      document: {
        id: "id",
        index: [{ field: "title" }, { field: "content" }],
        store: ["title", "filename", "content"],
      },
      tokenize: "forward",
      suggest: true,
    });

    this.STORAGE_PATH = path.join(__dirname, "../document-store.json");
    this.UPLOAD_DIR = path.join(__dirname, "../../uploads");
    this.initialize();
  }

  async initialize() {
    // Load existing document metadata
    if (fs.existsSync(this.STORAGE_PATH)) {
      try {
        this.documents = JSON.parse(fs.readFileSync(this.STORAGE_PATH, "utf8"));
        this.documents.forEach((doc) => this.index.add(doc));
      } catch (err) {
        console.error("Error loading document store:", err);
      }
    }

    // Sync with upload directory
    const files = fs.readdirSync(this.UPLOAD_DIR);
    for (const file of files) {
      if (!this.documents.some((doc) => doc.filename === file)) {
        await this.processFile(file);
      }
    }
  }

  async processFile(filename) {
    try {
      const filePath = path.join(this.UPLOAD_DIR, filename);
      const data = await pdf(fs.readFileSync(filePath));

      const document = {
        id: this.documents.length + 1,
        title: path.parse(filename).name,
        filename,
        content: data.text.substring(0, 1000), // Store first 1000 chars
      };

      this.documents.push(document);
      this.index.add(document);
      this.persist();
    } catch (err) {
      console.error("Error processing file:", filename, err);
    }
  }

  persist() {
    try {
      fs.writeFileSync(
        this.STORAGE_PATH,
        JSON.stringify(this.documents, null, 2)
      );
    } catch (err) {
      console.error("Error saving document store:", err);
    }
  }

  search(query) {
    return this.index.search(query, { enrich: true });
  }
}

module.exports = new SearchService();
