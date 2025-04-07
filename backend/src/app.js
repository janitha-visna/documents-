const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const flowRoutes = require("./routes/flowRoutes");
const fetchflowRoutes = require("./routes/fetchflowRouter");
const { ensureUploadsDirExists } = require("./config/fileSystem");
const noderoute = require("./routes/findnoderouter");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
ensureUploadsDirExists();

// Serve static files from uploads directory
app.use("/files", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", fileRoutes);
app.use("/api", flowRoutes); 
app.use("/api",fetchflowRoutes);
app.use("/api",noderoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
