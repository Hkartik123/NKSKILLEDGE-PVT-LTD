const { JobOpening, JobApplication } = require('../models');
const { createNotification } = require('../services/auditService');

async function getJobs(req, res) {
  try {
    const jobs = await JobOpening.find();
    return res.json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs.' });
  }
}

async function createJob(req, res) {
  try {
    const newJob = await JobOpening.create({
      ...req.body,
      isActive: true
    });
    return res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create job opening.' });
  }
}

async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const updated = await JobOpening.findByIdAndUpdate(id, req.body);
    return res.json({ success: true, job: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update job.' });
  }
}

async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    await JobOpening.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
}

async function applyJob(req, res) {
  try {
    const { fullName, email, phone, position, resumeUrl, portfolioUrl, coverMessage } = req.body;
    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const application = await JobApplication.create({
      fullName,
      email,
      phone,
      position,
      resumeUrl: resumeUrl || '',
      portfolioUrl: portfolioUrl || '',
      coverMessage: coverMessage || '',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    });

    await createNotification(
      'New Career Application',
      `${fullName} applied for ${position}`,
      'job',
      '/admin/careers'
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our recruitment team will review your profile.',
      application
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
}

async function getJobApplications(req, res) {
  try {
    const apps = await JobApplication.find();
    apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch job applications.' });
  }
}

async function updateJobApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await JobApplication.findByIdAndUpdate(id, { status });
    return res.json({ success: true, application: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update application.' });
  }
}

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getJobApplications,
  updateJobApplicationStatus
};
