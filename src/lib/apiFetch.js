import { auth } from "../firebase";

export async function apiFetch(url, options = {}) {
  const user = auth.currentUser;
  const headers = { ...(options.headers || {}) };
  if (user) {
    try {
      const token = await user.getIdToken(false);
      headers["Authorization"] = `Bearer ${token}`;
    } catch {
      // proceed without token; server will use cookie
    }
  }
  return fetch(url, { ...options, headers, credentials: "include" });
}
