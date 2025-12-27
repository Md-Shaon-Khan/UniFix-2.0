const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sub_category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Submitted', 'In Progress', 'Resolved', 'Rejected', 'Closed'),
    defaultValue: 'Submitted'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  location: {
    type: DataTypes.STRING, // e.g., "Room 304, Block B"
    allowNull: true
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  impact_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Foreign Key for Student will be added in associations
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'complaints'
});

module.exports = Complaint;