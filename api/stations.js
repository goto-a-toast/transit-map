export default async function handler(req, res) {
  const key = process.env.ODPT_API_KEY;
  if (!key) return res.status(500).json({ error: 'ODPT_API_KEY not configured' });

  const operators = ['Toei', 'YokohamaMunicipal'];
  const results = await Promise.allSettled(
    operators.map(op =>
      fetch(`https://api.odpt.org/api/v4/odpt:Station?odpt:operator=odpt.Operator:${op}&acl:consumerKey=${key}`)
        .then(r => r.ok ? r.json() : [])
    )
  );

  const stations = {};
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const s of r.value) {
      const id  = s['owl:sameAs'];
      const lat = s['geo:lat'];
      const lng = s['geo:long'];
      if (id && lat != null && lng != null) {
        stations[id] = { lat, lng, name: s['dc:title'] || id.split('.').pop() };
      }
    }
  }

  res.setHeader('Cache-Control', 's-maxage=3600');
  res.json(stations);
}
