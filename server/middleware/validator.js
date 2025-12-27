module.exports = (schema) => (req, res, next) => {
  // very small validator: ensure required keys exist
  if (!schema || !schema.required) return next();
  const missing = [];
  for (const key of schema.required) if (req.body[key] === undefined) missing.push(key);
  if (missing.length) return res.status(400).json({ error: 'Missing fields', missing });
  next();
};
