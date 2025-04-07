import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import "./PdfDocument.css";


const workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

console.log("PDF.js Worker Source Path:", workerSrc);

function PdfDocument() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  // Log the pdfFile whenever it changes
  useEffect(() => {
    console.log("pdfFile:", pdfFile);
  }, [pdfFile]);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/upload");
      console.log("Fetched PDFs:", result.data); // Log the entire response
      setAllImage(result.data); // Set the response data directly
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log("FormData as Object:", Object.fromEntries(formData.entries()));
    console.log(title, file);
  

    try {
      const result = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf(); // Refresh the list after upload
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const showPdf = (filename) => {
    window.open(
      `http://localhost:5000/files/${filename}`,
      "_blank",
      "noreferrer"
    );
    //Use the correct URL
    setPdfFile(`http://localhost:5000/files/${filename}`);
  };

  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf in React</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => {
             setFile(e.target.files[0]); // Add this line
             console.log("First file:", e.target.files[0]);
          }}
        />
        <br />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null
            ? "No PDFs uploaded yet."
            : allImage.map((data) => {
                return (
                  <div className="inner-div" key={data.id}>
                    {" "}
                    {/* Add a key for React */}
                    <h6>Title: {data.title}</h6>
                    <p>Filename: {data.filename}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.filename)} // Use data.filename
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default PdfDocument;
