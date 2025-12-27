const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimelineEvent = sequelize.define('TimelineEvent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  complaint_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: true }, // Who triggered the event
  type: { 
    type: DataTypes.ENUM('submission', 'status_change', 'comment', 'vote'), 
    defaultValue: 'status_change' 
  },
  message: { type: DataTypes.STRING, allowNull: false }
}, { 
  tableName: 'timeline_events',
  timestamps: true 
});

module.exports = TimelineEvent;