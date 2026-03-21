const trimTrailingSlash = (value) => (value ? value.replace(/\/$/, "") : "");
const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_URL || (isProduction ? "" : "http://localhost:5000")
);
export const CHATBOT_API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_CHATBOT_URL || process.env.REACT_APP_CHATBOT_API_URL || (isProduction ? "" : "http://localhost:8000")
);
export const isChatbotConfigured = Boolean(CHATBOT_API_BASE_URL);

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
export const buildChatbotUrl = (path) => `${CHATBOT_API_BASE_URL}${path}`;