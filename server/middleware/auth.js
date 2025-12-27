const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'unifix_secret_key_123';

module.exports = (req, res, next) => {
  // 1. Get Token from Header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Attach User to Request
    req.user = decoded; // Contains { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};