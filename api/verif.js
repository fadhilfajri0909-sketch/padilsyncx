export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { gmail, link } = req.body;
        if (!gmail || !link) return res.status(400).json({ success: false, error: 'Gmail dan link wajib diisi' });

        const BYPASS_KEY = process.env.AM_BYPASS_KEY;

        const response = await fetch('https://am.dapjisync.my.id/api/verif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Bypass-Key': BYPASS_KEY,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({ gmail, link })
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return res.status(response.status).json({ success: response.ok, data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
