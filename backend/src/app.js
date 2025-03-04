const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const flowRoutes = require("./routes/flowRoutes");
const { ensureUploadsDirExists } = require("./config/fileSystem");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
ensureUploadsDirExists();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", fileRoutes);
app.use("/api", flowRoutes); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
