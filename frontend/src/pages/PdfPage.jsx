import React from "react";
import PdfDocument from "../components/PdfDocument";

const PdfPage = () => {
  try {
    return (
      <div>
        <h1>PDF Viewer Page</h1>
        <PdfDocument /> {/* Render PdfDocument directly */}
      </div>
    );
  } catch (error) {
    console.error("Error rendering PdfDocument:", error);
    return (
      <div style={{ color: "red" }}>
        An error occurred while loading the PDF.
      </div>
    );
  }
};

export default PdfPage;