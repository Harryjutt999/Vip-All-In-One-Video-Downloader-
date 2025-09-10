// api/facebook.js
// expects worker that returns { hd, sd } or { links: {HD, SD} }
export default async function handler(req, res){
  const { url } = req.query;
  if(!url) return res.status(400).json({ error: 'Missing url' });

  try {
    // primary worker
    const api = `https://facebook-video-downloader.apis-by-devs.workers.dev/?url=${encodeURIComponent(url)}`;
    let r = await fetch(api);
    let data = await safeJson(r);

    // try common shapes
    if(data && (data.hd || data.sd)) {
      return res.status(200).json({ hd: data.hd || null, sd: data.sd || null });
    }
    if(data && data.links) {
      return res.status(200).json({ hd: data.links.HD || data.links.hd || null, sd: data.links.SD || data.links.sd || null });
    }

    // fallback to other service (example)
    const alt = `https://facebook-video-downloader.fly.dev/api?url=${encodeURIComponent(url)}`;
    r = await fetch(alt);
    data = await safeJson(r);
    if(data && (data.hd || data.sd || (data.links && (data.links.HD || data.links.SD)))) {
      const hd = data.hd || data.links?.HD || null;
      const sd = data.sd || data.links?.SD || null;
      return res.status(200).json({ hd, sd });
    }

    return res.status(500).json({ error: 'Video not found in API response', raw: data || null });
  } catch(err){
    console.error('facebook err', err);
    return res.status(500).json({ error: 'Failed to fetch facebook', details: err.message });
  }
}

async function safeJson(resp){
  try { const txt = await resp.text(); return JSON.parse(txt); } catch(e){ try { return resp.json(); } catch(_) { return { raw: await resp.text() }; } }
}
