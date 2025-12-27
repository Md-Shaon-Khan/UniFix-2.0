const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  complaint_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true }
}, { 
  tableName: 'feedbacks',
  timestamps: true 
});

module.exports = Feedback;