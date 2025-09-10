// api/pinterest.js
export default async function handler(req, res){
  const { url } = req.query;
  if(!url) return res.status(400).json({ error:'Missing url' });

  try {
    const api = `https://pinterestvideodownloader.com/api/?url=${encodeURIComponent(url)}`;
    let r = await fetch(api);
    let data = await safeJson(r);

    if(data && (data.data || data.links || data.urls)) {
      const list = data.data || data.links || data.urls;
      const out = (Array.isArray(list) ? list : [list]).map(it=>{
        if(typeof it==='string') return { url: it, type:'video' };
        return { url: it.url || it.video || it.download, type: it.quality || it.type || 'video' };
      }).filter(x=>x.url);
      if(out.length) return res.status(200).json({ links: out });
    }

    return res.status(500).json({ error:'No media found', raw: data || null });
  } catch(err){
    console.error('pinterest err', err);
    return res.status(500).json({ error:'Failed to fetch pinterest', details: err.message });
  }
}

async function safeJson(resp){ try{ const t = await resp.text(); return JSON.parse(t);}catch(e){ try{return resp.json();}catch(_){return { raw: await resp.text() }}}
