export async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("VITE_FIREBASE_API_KEY is not set");
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Firebase error: ${err?.error?.message || response.status}`);
  }
  const data = await response.json();
  if (!data.users?.length) throw new Error("Firebase user not found");
  return data.users[0];
}
