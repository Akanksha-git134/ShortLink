/**
 * Pure helpers with no React and no network calls — safe to unit test
 * in complete isolation from the rest of the app.
 */

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function truncateMiddle(str, max = 42) {
  if (!str || str.length <= max) return str;
  const keep = Math.floor((max - 3) / 2);
  return `${str.slice(0, keep)}...${str.slice(str.length - keep)}`;
}

/**
 * Builds the full, clickable short URL from a shortCode.
 * WHY read from env: in development this points at localhost:5000,
 * in production it's the deployed Render URL — the component never
 * needs to know which environment it's running in.
 */
export function buildShortUrl(shortCode) {
  const base = import.meta.env.VITE_SHORT_URL_BASE || "http://localhost:5000";
  return `${base.replace(/\/$/, "")}/${shortCode}`;
}
