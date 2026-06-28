const BASE_URL = import.meta.env.VITE_API_URL || "https://api.unotravelsweden.com";

export function img(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
