export default async function handler(req, res) {
  const key = process.env.ODPT_API_KEY;
  if (!key) return res.status(500).json({ error: 'ODPT_API_KEY not configured' });

  const r = await fetch(`https://api.odpt.org/api/v4/odpt:Train?acl:consumerKey=${key}`);
  if (!r.ok) return res.status(r.status).json({ error: 'ODPT API error' });

  const data = await r.json();
  res.setHeader('Cache-Control', 's-maxage=25');
  res.json(data);
}
