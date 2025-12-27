// Simple in-memory rate limiter for demo purposes
const rateMap = new Map();
const WINDOW_MS = 60 * 1000;
const MAX = 120;

module.exports = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const entry = rateMap.get(ip) || { count: 0, start: Date.now() };
  if (Date.now() - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = Date.now();
  }
  entry.count++;
  rateMap.set(ip, entry);
  if (entry.count > MAX) return res.status(429).json({ error: 'Too many requests' });
  next();
};
