export default async function handler(req, res) {
  try {
    let { url } = req.query;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    // Resolve VM short link
    if (url.includes("vm.tiktok.com")) {
      url = await resolveRedirect(url);
      console.log("Resolved TikTok URL:", url);
    }

    const actor = 'scraper-mind~tiktok-video-downloader';  // ✅ fix slug
    const token = process.env.APIFY_TOKEN;

    const apiUrl = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset?token=${encodeURIComponent(token)}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'Apify error', details: text });
    }

    const data = await response.json();
    const items = data.items || data;
    if (!items || items.length === 0) return res.status(404).json({ error: 'No items' });

    const first = items[0];
    const video = first.video || first.url || first.downloadUrl || first.videoUrl || first.src;

    return res.status(200).json({ video, raw: first });
  } catch (err) {
    console.error('tiktok error:', err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}

async function resolveRedirect(url) {
  const res = await fetch(url, { redirect: "follow" });
  return res.url;
}
