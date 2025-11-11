import axios from "axios";

const apiPortaHttps = "7142"; // confirme no launchSettings.json

const baseURL = `https://localhost:${apiPortaHttps}/api/`;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;