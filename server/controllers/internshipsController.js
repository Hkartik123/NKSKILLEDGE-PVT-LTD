const { InternshipApp } = require('../models');
const { createNotification } = require('../services/auditService');

async function applyInternship(req, res) {
  try {
    const { fullName, email, phone, college, course, year, domain, duration, resumeUrl, message } = req.body;
    if (!fullName || !email || !phone || !domain) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const app = await InternshipApp.create({
      fullName,
      email,
      phone,
      college: college || '',
      course: course || '',
      year: year || '',
      domain,
      duration: duration || '3 Months',
      resumeUrl: resumeUrl || '',
      message: message || '',
      status: 'Under Review',
      createdAt: new Date().toISOString()
    });

    await createNotification(
      'New Internship Application',
      `${fullName} applied for ${domain} Internship`,
      'internship',
      '/admin/registrations'
    );

    return res.status(201).json({
      success: true,
      message: 'Internship application submitted successfully! We will contact you after review.',
      application: app
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
}

async function getInternshipApplications(req, res) {
  try {
    const list = await InternshipApp.find();
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, count: list.length, applications: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch internship applications.' });
  }
}

async function updateInternshipStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await InternshipApp.findByIdAndUpdate(id, { status });
    return res.json({ success: true, message: 'Application updated', application: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update.' });
  }
}

module.exports = {
  applyInternship,
  getInternshipApplications,
  updateInternshipStatus
};
