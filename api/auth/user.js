export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.status(401).json({ message: "Unauthorized" });
}
