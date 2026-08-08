import axios from "axios";

/**
 * WHY this file is the ONLY place that imports axios: every component
 * calls a named function (shortenUrl, fetchLinks) instead of building
 * its own request. If the backend URL, headers, or error shape ever
 * change, this is the one file that needs editing.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Sends a URL to the backend and returns the created { shortCode }.
 * Errors are re-thrown with a clean, user-facing message so components
 * never have to parse axios's error shape themselves.
 */
export async function shortenUrl(url) {
  try {
    const response = await apiClient.post("/api/shorten", { url });
    return response.data; // { shortCode }
  } catch (error) {
    const message = error.response?.data?.message || "Couldn't shorten that URL. Please try again.";
    throw new Error(message);
  }
}

/**
 * Fetches all previously shortened links, newest first.
 */
export async function fetchLinks() {
  try {
    const response = await apiClient.get("/api/links");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Couldn't load link history.";
    throw new Error(message);
  }
}

export async function deleteLink(shortCode) {
  try {
    await apiClient.delete(`/api/links/${shortCode}`);
  } catch (error) {
    const message = error.response?.data?.message || "Couldn't delete that link.";
    throw new Error(message);
  }
}

export default apiClient;
