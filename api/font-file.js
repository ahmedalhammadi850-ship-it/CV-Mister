export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const url = req.query.url;
  if (!url || !url.startsWith("https://fonts.gstatic.com/")) {
    return res.status(400).send("Invalid font file URL");
  }
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "font/woff2");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.end(Buffer.from(buffer));
  } catch {
    return res.status(500).send("");
  }
}
