const { SiteSetting } = require('../models');
const { logAuditAction } = require('../services/auditService');

async function getSettings(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = {
        companyName: 'NK SkillEdge Pvt. Ltd.',
        tagline: 'Shaping Skills, Building Futures',
        phones: ['7498784109', '9356049629'],
        email: 'hmendhe72@gmail.com',
        office: 'NK SkillEdge Pvt. Ltd., Near Gobade Hospital, Sakoli',
        stats: {
          studentsTrained: '200+',
          studentsPlaced: '50+',
          activeProjects: '15+',
          happyClients: '30+',
          projectsCompleted: '50+',
          upcomingProjects: '10+'
        }
      };
    }
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
}

async function updateSettings(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    let updated;
    if (settings) {
      updated = await SiteSetting.findByIdAndUpdate(settings._id, req.body);
    } else {
      updated = await SiteSetting.create(req.body);
    }
    await logAuditAction(req.user, 'UPDATE_SITE_SETTINGS', 'Settings', req.body);
    return res.json({ success: true, message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
}

// Dedicated endpoint to update statistics specifically
async function updateStats(req, res) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not initialized' });
    }

    const newStats = {
      ...settings.stats,
      ...req.body
    };

    const updated = await SiteSetting.findByIdAndUpdate(settings._id, { stats: newStats });
    await logAuditAction(req.user, 'UPDATE_STATISTICS', 'Settings', { stats: newStats });

    return res.json({ success: true, message: 'Company statistics updated', stats: newStats });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update stats' });
  }
}

module.exports = {
  getSettings,
  updateSettings,
  updateStats
};
