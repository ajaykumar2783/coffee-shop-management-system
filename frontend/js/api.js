// Auto-detect environment
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const API_BASE_URL = isLocalhost
  ? "http://127.0.0.1:5000/api"
  : "https://coffee-shop-management-system-k2o5.onrender.com";

const API_BASE = `${API_BASE_URL}/api`;
