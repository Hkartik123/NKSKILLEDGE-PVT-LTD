const { AuditLog, Notification } = require('../models');

async function logAuditAction(adminUser, action, moduleName, details = {}) {
  try {
    const log = await AuditLog.create({
      adminId: adminUser ? adminUser._id : 'system',
      adminName: adminUser ? adminUser.name : 'System',
      adminEmail: adminUser ? adminUser.email : 'system@nkskilledge.com',
      action,
      module: moduleName,
      details,
      timestamp: new Date().toISOString()
    });
    return log;
  } catch (err) {
    console.error('Error writing audit log:', err.message);
  }
}

async function createNotification(title, message, type = 'info', link = null) {
  try {
    const notification = await Notification.create({
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
}

module.exports = {
  logAuditAction,
  createNotification
};
