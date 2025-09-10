// api/tiktok.js
// tries few public TikTok helpers (primary: tikwm), returns { noWatermark, watermark } or { error, raw }
export default async function handler(req, res) {
  const { url } = req.query;
  if(!url) return res.status(400).json({ error: 'Missing url' });

  try {
    // primary: tikwm
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    let r = await fetch(api);
    let data = await safeJson(r);

    // tikwm returns data.data.play (no wm) and data.data.wmplay (wm)
    if(data && data.data && (data.data.play || data.data.wmplay)) {
      return res.status(200).json({
        noWatermark: data.data.play || null,
        watermark: data.data.wmplay || null
      });
    }

    // fallback: try another known worker
    const alt = `https://tiktok-down.apis-bj-devs.workers.dev/?url=${encodeURIComponent(url)}`;
    r = await fetch(alt);
    data = await safeJson(r);
    // try common keys
    const no = data?.no_wm || data?.noWatermark || data?.play || data?.video;
    const wm  = data?.wmplay || data?.watermark || data?.wm;
    if(no || wm) return res.status(200).json({ noWatermark: no || null, watermark: wm || null });

    // nothing useful
    return res.status(500).json({ error: 'Video not found in responses', raw: data || null });
  } catch (err) {
    console.error('tiktok err', err);
    return res.status(500).json({ error: 'Failed to fetch tiktok', details: err.message });
  }
}

async function safeJson(resp){
  try {
    const txt = await resp.text();
    return JSON.parse(txt);
  } catch(e){
    try { return resp.json(); } catch(_){ return { raw: await resp.text() }; }
  }
  }
