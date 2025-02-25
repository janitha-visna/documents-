import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const uploadFile = (formData) => {
  return api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
