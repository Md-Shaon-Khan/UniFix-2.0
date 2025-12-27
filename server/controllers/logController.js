const { AuditLog } = require('../models');

exports.create = async (req, res) => {
  try {
    const { action, details } = req.body;
    // Save to DB (Fire and forget)
    AuditLog.create({
      user_id: req.user ? req.user.id : null,
      action: action || 'client_event',
      details: JSON.stringify(details || {}),
      ip_address: req.ip
    });
    res.json({ ok: true });
  } catch (err) {
    // Don't crash if logging fails
    console.warn('Log failed:', err.message);
    res.status(200).json({ ok: false });
  }
};