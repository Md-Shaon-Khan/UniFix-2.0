const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  related_link: {
    type: DataTypes.STRING, // Link to the complaint (e.g., "/complaint/123")
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

module.exports = Notification;