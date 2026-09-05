const { Certificate } = require('../models');
const { logAuditAction } = require('../services/auditService');

async function verifyCertificate(req, res) {
  try {
    const { certificateId } = req.params;
    if (!certificateId) {
      return res.status(400).json({ success: false, message: 'Please provide a Certificate ID to verify.' });
    }

    const certs = await Certificate.find();
    const cert = certs.find(c => c.certificateId && c.certificateId.trim().toUpperCase() === certificateId.trim().toUpperCase());

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'No certificate found matching the provided ID. Please verify the ID on your printed credential.'
      });
    }

    return res.json({
      success: true,
      valid: cert.status === 'Valid',
      certificate: {
        certificateId: cert.certificateId,
        studentName: cert.studentName,
        course: cert.course,
        issueDate: cert.issueDate,
        completionDate: cert.completionDate,
        grade: cert.grade || 'Certified',
        status: cert.status, // Valid, Invalid, Revoked
        organization: cert.organization || 'NK SkillEdge Pvt. Ltd.',
        verifiedBy: cert.verifiedBy || 'Authorized Academic Directorate',
        projectTitle: cert.projectTitle || ''
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error verifying certificate.' });
  }
}

async function listCertificates(req, res) {
  try {
    const certs = await Certificate.find();
    return res.json({ success: true, count: certs.length, certificates: certs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching certificates.' });
  }
}

async function issueCertificate(req, res) {
  try {
    const { certificateId, studentName, course, completionDate, grade, projectTitle } = req.body;
    if (!certificateId || !studentName || !course) {
      return res.status(400).json({ success: false, message: 'Certificate ID, Student Name, and Course are required.' });
    }

    const existing = await Certificate.findOne({ certificateId: certificateId.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A certificate with this ID already exists.' });
    }

    const newCert = await Certificate.create({
      certificateId: certificateId.trim().toUpperCase(),
      studentName,
      course,
      issueDate: new Date().toISOString().split('T')[0],
      completionDate: completionDate || new Date().toISOString().split('T')[0],
      grade: grade || 'A',
      status: 'Valid',
      organization: 'NK SkillEdge Pvt. Ltd.',
      verifiedBy: req.user.name,
      projectTitle: projectTitle || ''
    });

    await logAuditAction(req.user, 'ISSUE_CERTIFICATE', 'Certificates', { certificateId: newCert.certificateId });

    return res.status(201).json({ success: true, message: 'Certificate issued successfully', certificate: newCert });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error issuing certificate.' });
  }
}

async function updateCertificate(req, res) {
  try {
    const { id } = req.params;
    const updated = await Certificate.findByIdAndUpdate(id, req.body);
    await logAuditAction(req.user, 'UPDATE_CERTIFICATE', 'Certificates', { id });
    return res.json({ success: true, certificate: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating certificate.' });
  }
}

module.exports = {
  verifyCertificate,
  listCertificates,
  issueCertificate,
  updateCertificate
};
