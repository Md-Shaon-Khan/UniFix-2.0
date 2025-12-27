const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true }, // Changed meta to details for MySQL compatibility
  ip_address: { type: DataTypes.STRING, allowNull: true }
}, { 
  tableName: 'audit_logs',
  timestamps: true 
});

module.exports = AuditLog;