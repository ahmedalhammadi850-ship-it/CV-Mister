export const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiFetch(url, options) {
  return fetch(`${API_BASE}${url}`, options);
}
