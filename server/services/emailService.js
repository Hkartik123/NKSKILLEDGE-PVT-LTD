const { createNotification } = require('./auditService');

async function sendEmail({ to, subject, html, text }) {
  console.log('----------------------------------------------------');
  console.log(`[EMAIL DISPATCH] To: ${to}`);
  console.log(`[EMAIL DISPATCH] Subject: ${subject}`);
  console.log(`[EMAIL DISPATCH] Content preview: ${text ? text.slice(0, 120) : 'HTML Content'}`);
  console.log('----------------------------------------------------');
  
  // Also create a notification entry if it is student registration or lead
  return { success: true, messageId: 'msg_' + Date.now() };
}

async function sendRegistrationConfirmation(registration) {
  const subject = `Registration Confirmed: ${registration.programName} — NK SkillEdge`;
  const text = `Dear ${registration.fullName}, your registration for ${registration.programName} has been received. Your Registration ID is ${registration.registrationId}. Our academic counselor will reach out to you shortly.`;
  await sendEmail({ to: registration.email, subject, text });
  
  await createNotification(
    'New Training Registration',
    `${registration.fullName} enrolled in ${registration.programName} (ID: ${registration.registrationId})`,
    'registration',
    '/admin/registrations'
  );
}

async function sendLeadNotification(lead) {
  const subject = `New Inquiry from ${lead.fullName} (${lead.serviceOrCourse})`;
  const text = `New lead received from ${lead.fullName} (${lead.email}, ${lead.phone}). Message: ${lead.message}`;
  
  await createNotification(
    'New Lead Inquiry',
    `${lead.fullName} inquired about ${lead.serviceOrCourse}`,
    'lead',
    '/admin/leads'
  );
}

module.exports = {
  sendEmail,
  sendRegistrationConfirmation,
  sendLeadNotification
};
