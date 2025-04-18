const searchService = require("../services/searchService");

const processResults = (rawResults) => {
  const unique = new Map();
  rawResults.forEach(({ result }) => {
    result.forEach(({ doc }) => {
      if (!unique.has(doc.id)) unique.set(doc.id, doc);
    });
  });
  return Array.from(unique.values());
};

const search = (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.json([]);

    const results = processResults(searchService.search(query));
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

const suggest = (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.json([]);

    const suggestions = searchService.search(query).flatMap(({ result }) =>
      result.map(({ doc }) => ({
        id: doc.id,
        title: doc.title,
        preview: doc.content.substring(0, 100) + "...",
      }))
    );

    res.json(suggestions.slice(0, 5));
  } catch (err) {
    console.error("Suggest error:", err);
    res.status(500).json({ error: "Suggestion failed" });
  }
};

module.exports = { search, suggest };
