import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
