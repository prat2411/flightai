const trimTrailingSlash = (value) => (value ? value.replace(/\/$/, "") : "");

export const API_BASE_URL = trimTrailingSlash(process.env.REACT_APP_API_URL || "http://localhost:5000");
export const CHATBOT_API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_CHATBOT_URL || process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:8000"
);

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
export const buildChatbotUrl = (path) => `${CHATBOT_API_BASE_URL}${path}`;