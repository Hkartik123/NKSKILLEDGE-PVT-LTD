const { Lead } = require('../models');
const { sendLeadNotification } = require('../services/emailService');
const { logAuditAction } = require('../services/auditService');

async function createLead(req, res) {
  try {
    const { fullName, email, phone, userType, serviceOrCourse, message, budget, preferredTime, city } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name and phone number.' });
    }

    const lead = await Lead.create({
      fullName,
      email: email || '',
      phone,
      userType: userType || 'Student',
      serviceOrCourse: serviceOrCourse || 'General Inquiry',
      message: message || '',
      budget: budget || '',
      preferredTime: preferredTime || '',
      city: city || '',
      status: 'New', // New, Contacted, Qualified, Converted, Closed
      source: req.body.source || 'Website Contact Form',
      notes: []
    });

    await sendLeadNotification(lead);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our team will contact you shortly.',
      leadId: lead._id
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
}

async function getLeads(req, res) {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    
    let leads = await Lead.find(query);
    
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => 
        (l.fullName && l.fullName.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.serviceOrCourse && l.serviceOrCourse.toLowerCase().includes(q))
      );
    }

    // Sort descending by createdAt
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
}

async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (note) {
      const notes = lead.notes || [];
      notes.push({
        text: note,
        addedBy: req.user.name,
        date: new Date().toISOString()
      });
      updates.notes = notes;
    }

    const updated = await Lead.findByIdAndUpdate(id, updates);
    await logAuditAction(req.user, 'UPDATE_LEAD', 'Leads', { leadId: id, status, note });

    return res.json({ success: true, message: 'Lead updated successfully', lead: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update lead.' });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    await Lead.findByIdAndDelete(id);
    await logAuditAction(req.user, 'DELETE_LEAD', 'Leads', { leadId: id });
    return res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete lead.' });
  }
}

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead
};
