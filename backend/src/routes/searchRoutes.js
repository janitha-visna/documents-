const express = require("express");
const router = express.Router();
const { search, suggest } = require("../controllers/searchController");

// Define routes properly
router.get("/search", search);
router.get("/suggest", suggest);

// Export the router directly
module.exports = router;
