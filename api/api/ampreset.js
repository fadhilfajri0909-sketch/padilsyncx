export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL wajib diisi' });
    
    try {
        const response = await fetch('https://bintangapi.my.id/api/amfind/?url=' + encodeURIComponent(url), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                'Accept': '*/*',
                'Origin': 'https://starlabs.biz.id',
                'Referer': 'https://starlabs.biz.id/'
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
