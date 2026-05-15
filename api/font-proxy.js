export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const url = req.query.url;
  if (!url || !url.startsWith("https://fonts.googleapis.com/")) {
    return res.status(400).send("Invalid font URL");
  }
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
    });
    const css = await response.text();
    const rewritten = css.replace(
      /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g,
      "url(/api/font-file?url=$1)"
    );
    res.setHeader("Content-Type", "text/css");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(rewritten);
  } catch (err) {
    return res.status(500).send("");
  }
}
