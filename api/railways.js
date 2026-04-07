export default async function handler(req, res) {
  const key = process.env.ODPT_API_KEY;
  if (!key) return res.status(500).json({ error: 'ODPT_API_KEY not configured' });

  const operators = ['Toei', 'YokohamaMunicipal'];
  const results = await Promise.allSettled(
    operators.map(op =>
      fetch(`https://api.odpt.org/api/v4/odpt:Railway?odpt:operator=odpt.Operator:${op}&acl:consumerKey=${key}`)
        .then(r => r.ok ? r.json() : [])
    )
  );

  const railways = [];
  for (const r of results) {
    if (r.status === 'fulfilled') railways.push(...r.value);
  }

  res.setHeader('Cache-Control', 's-maxage=3600');
  res.json(railways);
}
