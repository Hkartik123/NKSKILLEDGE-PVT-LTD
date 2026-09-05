const models = require('../models');

async function getDashboardStats(req, res) {
  try {
    const totalLeads = await models.Lead.countDocuments();
    const newLeads = await models.Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await models.Lead.countDocuments({ status: 'Qualified' });
    const convertedLeads = await models.Lead.countDocuments({ status: 'Converted' });

    const totalRegistrations = await models.Registration.countDocuments();
    const pendingRegistrations = await models.Registration.countDocuments({ status: 'Pending' });

    const totalInternshipApps = await models.InternshipApp.countDocuments();
    const totalJobApps = await models.JobApplication.countDocuments();

    const totalServices = await models.Service.countDocuments();
    const totalPrograms = await models.Program.countDocuments();
    const totalProjects = await models.Project.countDocuments();
    const totalBlogs = await models.BlogPost.countDocuments();
    const totalEvents = await models.Event.countDocuments();
    const totalCertificates = await models.Certificate.countDocuments();

    // Lead stage pipeline breakdown
    const leads = await models.Lead.find();
    const pipeline = {
      New: leads.filter(l => l.status === 'New').length,
      Contacted: leads.filter(l => l.status === 'Contacted').length,
      Qualified: leads.filter(l => l.status === 'Qualified').length,
      Converted: leads.filter(l => l.status === 'Converted').length,
      Closed: leads.filter(l => l.status === 'Closed').length
    };

    // Recent 5 leads
    const recentLeads = leads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Recent 5 registrations
    const regs = await models.Registration.find();
    const recentRegistrations = regs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return res.json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        totalRegistrations,
        pendingRegistrations,
        totalInternshipApps,
        totalJobApps,
        totalServices,
        totalPrograms,
        totalProjects,
        totalBlogs,
        totalEvents,
        totalCertificates
      },
      pipeline,
      recentLeads,
      recentRegistrations
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
}

async function getNotifications(req, res) {
  try {
    const notifications = await models.Notification.find();
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
}

async function markNotificationsAsRead(req, res) {
  try {
    const list = await models.Notification.find();
    for (const n of list) {
      if (!n.isRead) {
        await models.Notification.findByIdAndUpdate(n._id, { isRead: true });
      }
    }
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
}

async function getAuditLogs(req, res) {
  try {
    const logs = await models.AuditLog.find();
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
}

module.exports = {
  getDashboardStats,
  getNotifications,
  markNotificationsAsRead,
  getAuditLogs
};
