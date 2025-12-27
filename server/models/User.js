const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'authority', 'admin'),
    defaultValue: 'student'
  },
  // Extra fields for Student Profile
  student_id: {
    type: DataTypes.STRING,
    allowNull: true // Only for students
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true // For students & authorities
  },
  hall: {
    type: DataTypes.STRING,
    allowNull: true
  },
  credibility_score: {
    type: DataTypes.INTEGER,
    defaultValue: 50 // Start with neutral credibility
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'users'
});

module.exports = User;