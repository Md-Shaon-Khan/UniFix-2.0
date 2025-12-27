const { Notification } = require('../models');

// List my notifications
exports.list = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark one as read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ is_read: true }, {
      where: { id, user_id: req.user.id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark all as read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.update({ is_read: true }, {
      where: { user_id: req.user.id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};