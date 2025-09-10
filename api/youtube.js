// api/youtube.js
// NOTE: many yt download endpoints require POST/complex flows. This tries one known service and returns formats array.
export default async function handler(req, res){
  const { url } = req.query;
  if(!url) return res.status(400).json({ error:'Missing url' });

  try {
    // Example: yt1s (may require form-data). Try search endpoint
    const api = `https://yt1s.com/api/ajaxSearch/index?url=${encodeURIComponent(url)}&vt=home`;
    let r = await fetch(api, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
    let data = await safeJson(r);

    // data may contain title and links
    if(data && (data.title || data.links || data.linksResult || data.formats)) {
      // try to normalize
      const formats = [];
      if(data.links && data.links.mp4) {
        Object.keys(data.links.mp4).forEach(k=>{
          const item = data.links.mp4[k];
          formats.push({ qualityLabel: item.quality || k, url: item.link || item.url });
        });
      } else if(Array.isArray(data.formats)) {
        data.formats.forEach(f=> formats.push({ qualityLabel: f.quality || f.qualityLabel || f.label, url: f.url || f.link }));
      } else if(data.linksResult && data.linksResult.mp4) {
        Object.values(data.linksResult.mp4).forEach(f=> formats.push({ qualityLabel: f.qualityLabel || f.quality, url: f.link }));
      }

      if(formats.length) return res.status(200).json({ title: data.title || null, formats });
    }

    return res.status(500).json({ error:'No formats found', raw: data || null });
  } catch(err){
    console.error('youtube err', err);
    return res.status(500).json({ error:'Failed to fetch youtube', details: err.message });
  }
}

async function safeJson(resp){ try{ const t = await resp.text(); return JSON.parse(t);}catch(e){ try{return resp.json();}catch(_){return { raw: await resp.text() }}}
