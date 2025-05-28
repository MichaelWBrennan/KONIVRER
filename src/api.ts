import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Proxy to your backend
});

export default api;
