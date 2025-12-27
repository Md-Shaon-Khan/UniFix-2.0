const { Complaint, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.summary = async (req, res) => {
  try {
    const total = await Complaint.count();
    const resolved = await Complaint.count({ where: { status: 'Resolved' } });
    const pending = await Complaint.count({ 
      where: { status: { [Op.or]: ['Submitted', 'In Progress'] } } 
    });

    res.json({ total, resolved, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.trends = async (req, res) => {
  try {
    // Group by month (MySQL Syntax)
    const trends = await Complaint.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('created_at')), 'month'],
        [sequelize.fn('COUNT', 'id'), 'count']
      ],
      group: ['month'],
      order: [['month', 'ASC']]
    });
    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};