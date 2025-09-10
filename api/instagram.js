// api/instagram.js
// tries saveig / other services; returns { links: [ {url, type}, ... ] }
export default async function handler(req, res){
  const { url } = req.query;
  if(!url) return res.status(400).json({ error:'Missing url' });

  try {
    // primary: saveig.app (example)
    const api = `https://saveig.app/api/ajaxSearch?url=${encodeURIComponent(url)}`;
    let r = await fetch(api, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    let data = await safeJson(r);

    if(data && (data.medias || data.links || data.download)) {
      // normalize
      const sources = data.medias || data.links || data.download || [];
      const out = (Array.isArray(sources) ? sources : [sources]).map(s=>{
        if(typeof s === 'string') return { url: s, type: 'media' };
        return { url: s.url || s.src || s.download || s.file, type: s.type || s.format || 'media' };
      }).filter(x=>x.url);
      if(out.length) return res.status(200).json({ links: out });
    }

    // fallback: try another worker (example)
    const alt = `https://instagram-downloader.example.workers.dev/?url=${encodeURIComponent(url)}`;
    r = await fetch(alt);
    data = await safeJson(r);
    if(data && data.links) return res.status(200).json({ links: data.links });

    return res.status(500).json({ error:'No media found', raw: data || null });
  } catch(err){
    console.error('instagram err', err);
    return res.status(500).json({ error:'Failed to fetch instagram', details: err.message });
  }
}

async function safeJson(resp){ try{ const t = await resp.text(); return JSON.parse(t);}catch(e){ try{ return resp.json(); }catch(_){ return { raw: await resp.text() }; } } }
