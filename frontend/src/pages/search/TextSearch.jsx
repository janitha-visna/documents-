import "./TextSearch.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const highlightText = (text, query) => {
  if (!query) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = debounce(async (searchText) => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/search/suggest",
        { params: { q: searchText } }
      );
      setSuggestions(response.data);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  const handleSearch = async (searchQuery) => {
    const searchTerm = searchQuery ?? query;

    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/api/search", {
        params: { q: searchTerm },
      });
      setResults(response.data);
      setSuggestions([]);
      if (response.data.length === 0) {
        setError("No documents found matching your search");
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    const pdfUrl = `http://localhost:5000/files/${suggestion.title}.pdf`;
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h2>Discover Documents</h2>
      </div>

      <div className="search-box">
        <div className="suggestions-wrapper">
          <div className="input-container">
            <input
              type="text"
              placeholder="Search by title or content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-badge">
                    <svg className="file-icon" viewBox="0 0 24 24">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
                    </svg>
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">
                      {highlightText(suggestion.title, query)}
                    </div>
                    <div className="suggestion-text">
                      {highlightText(suggestion.preview, query)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
          {error}
        </div>
      )}

      <div className="results">
        {results.map((doc) => (
          <div key={doc.title} className="result-item">
            <div className="result-header">
              <svg className="file-icon" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
              </svg>
              <h3>{highlightText(doc.title, query)}</h3>
            </div>
            <p className="content-preview">
              {highlightText(doc.preview?.substring(0, 150), query)}...
            </p>
            <a
              href={`http://localhost:5000/files/${doc.title}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              View PDF
              <svg className="external-icon" viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
