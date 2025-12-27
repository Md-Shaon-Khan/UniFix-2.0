const { sequelize } = require('../config/db');

// Import all models
const User = require('./User');
const Complaint = require('./Complaint');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const Category = require('./Category');
const Feedback = require('./Feedback');
const TimelineEvent = require('./TimelineEvent');

// --- Associations ---

// User Relationships
User.hasMany(Complaint, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.hasMany(Feedback, { foreignKey: 'user_id' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });

// Complaint Relationships
Complaint.belongsTo(User, { foreignKey: 'user_id', as: 'student' }); // Alias 'student' for frontend
Complaint.hasMany(TimelineEvent, { foreignKey: 'complaint_id', as: 'timeline' });
Complaint.hasMany(Feedback, { foreignKey: 'complaint_id' });
// Optional: Complaint.belongsTo(Category, { foreignKey: 'category_id' });

// Other Relationships
Notification.belongsTo(User, { foreignKey: 'user_id' });
TimelineEvent.belongsTo(Complaint, { foreignKey: 'complaint_id' });
TimelineEvent.belongsTo(User, { foreignKey: 'user_id' });

// Export everything
module.exports = {
  sequelize,
  User,
  Complaint,
  Notification,
  AuditLog,
  Category,
  Feedback,
  TimelineEvent
};