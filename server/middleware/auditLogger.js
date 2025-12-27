const { AuditLog } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    await AuditLog.create({ user_id: userId, action: `${req.method} ${req.originalUrl}`, meta: { body: req.body } });
  } catch (e) {
    // ignore
  }
  next();
};
