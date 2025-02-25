import { useState } from "react";
import { uploadFile } from "../services/api";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      setUploadStatus(
        `Upload successful! File path: ${response.data.filepath}`
      );
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload a PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;
