// api/downloader.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const api = `https://socialdownloder2.anshapi.workers.dev/?url=${encodeURIComponent(url)}`;
    const r = await fetch(api);
    const data = await r.json();

    // Direct pass-through
    return res.status(200).json(data);
  } catch (err) {
    console.error("downloader err", err);
    return res.status(500).json({ error: "Failed to fetch", details: err.message });
  }
}
