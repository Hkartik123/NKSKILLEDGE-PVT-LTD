const { randomBytes } = require('crypto');
const { Registration } = require('../models');
const { logAuditAction } = require('../services/auditService');
const {
  getWhatsAppConfiguration,
  sendInternshipDemoWhatsAppNotification
} = require('../services/whatsappService');

const EDUCATION_LEVELS = new Set([
  '10th/12th',
  'Diploma',
  'B.E./B.Tech',
  'BCA/BSc CS/IT',
  'MCA/MSc',
  'Other'
]);

const INTERNSHIP_DOMAINS = new Set([
  'Web Development',
  'App Development',
  'Cyber Security',
  'Python',
  'AI/ML',
  'Data Analytics',
  'Full-Stack Development',
  'IoT',
  'Cloud/DevOps',
  'UI/UX Design'
]);

const DEMO_DAYS = new Set(['Saturday', 'Sunday']);
const VALID_STATUSES = new Set(['PENDING_CONFIRMATION', 'CONTACTED', 'CONFIRMED']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateRegistration(body) {
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const mobileNumber = typeof body.mobileNumber === 'string' ? body.mobileNumber.replace(/\D/g, '') : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const collegeName = typeof body.collegeName === 'string' ? body.collegeName.trim() : '';
  const educationLevel = body.educationLevel;
  const semesterYear = typeof body.semesterYear === 'string' ? body.semesterYear.trim() : '';
  const selectedDomain = body.selectedDomain;
  const preferredDemoDay = body.preferredDemoDay;
  const city = typeof body.city === 'string' ? body.city.trim() : '';

  if (!fullName || fullName.length > 120) return 'Enter a full name of 1 to 120 characters.';
  if (!/^[6-9]\d{9}$/.test(mobileNumber)) return 'Enter a valid 10-digit Indian mobile number.';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (!collegeName || collegeName.length > 200) return 'Enter a college or institute name of 1 to 200 characters.';
  if (!EDUCATION_LEVELS.has(educationLevel)) return 'Select a valid education level.';
  if (semesterYear.length > 100) return 'Semester/year must be 100 characters or fewer.';
  if (!INTERNSHIP_DOMAINS.has(selectedDomain)) return 'Select a valid internship domain.';
  if (!DEMO_DAYS.has(preferredDemoDay)) return 'Select Saturday or Sunday as the preferred demo day.';
  if (city.length > 100) return 'City must be 100 characters or fewer.';

  return {
    fullName,
    mobileNumber,
    email,
    collegeName,
    educationLevel,
    semesterYear,
    selectedDomain,
    preferredDemoDay,
    city
  };
}

function isSameSubmission(existing, submitted) {
  return existing.registrationType === 'INTERNSHIP_DEMO'
    && ['fullName', 'mobileNumber', 'email', 'collegeName', 'educationLevel', 'semesterYear', 'selectedDomain', 'preferredDemoDay', 'city']
      .every(field => (existing[field] || '') === (submitted[field] || ''));
}

async function createInternshipDemoRegistration(req, res) {
  const idempotencyKey = req.get('Idempotency-Key');
  if (!idempotencyKey || !UUID_PATTERN.test(idempotencyKey)) {
    return res.status(400).json({
      success: false,
      message: 'A valid Idempotency-Key is required. Please submit the form again.'
    });
  }

  const submission = validateRegistration(req.body || {});
  if (typeof submission === 'string') {
    return res.status(400).json({ success: false, message: submission });
  }

  const registrationId = `NKSK-DEMO-${new Date().getFullYear()}-${randomBytes(8).toString('hex').toUpperCase()}`;
  let registration;

  try {
    registration = await Registration.create({
      _id: idempotencyKey,
      registrationType: 'INTERNSHIP_DEMO',
      registrationId,
      ...submission,
      status: 'PENDING_CONFIRMATION',
      whatsappNotificationStatus: 'PENDING'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      try {
        const existing = await Registration.findById(idempotencyKey);
        if (existing && isSameSubmission(existing, submission)) {
          return res.status(200).json({
            success: true,
            message: 'Registration was already saved.',
            registrationId: existing.registrationId
          });
        }
        if (existing) {
          return res.status(409).json({
            success: false,
            message: 'This submission key was already used for different registration details. Please refresh the form and try again.'
          });
        }
      } catch (lookupError) {
        console.error('Internship demo duplicate lookup failed.');
        return res.status(500).json({
          success: false,
          message: 'We could not verify the previous submission. Please contact the team before submitting again.'
        });
      }
    }

    console.error('Internship demo registration could not be saved.');
    return res.status(500).json({
      success: false,
      message: 'We could not save your registration. Please try again.'
    });
  }

  const configuration = getWhatsAppConfiguration();
  let notificationStatus = 'NOT_CONFIGURED';
  let providerMessageId;

  if (configuration.configured) {
    const notification = await sendInternshipDemoWhatsAppNotification(registration);
    notificationStatus = notification.status;
    providerMessageId = notification.providerMessageId;
  } else {
    console.info(`Internship demo WhatsApp notification not configured; missing ${configuration.missing.join(', ')}.`);
  }

  try {
    await Registration.findByIdAndUpdate(idempotencyKey, {
      whatsappNotificationStatus: notificationStatus,
      ...(providerMessageId ? { whatsappProviderMessageId: providerMessageId } : {})
    });
  } catch {
    console.error('Internship demo WhatsApp notification status could not be persisted.');
  }

  return res.status(201).json({
    success: true,
    message: 'Registration submitted successfully.',
    registrationId: registration.registrationId,
    whatsappNotificationStatus: notificationStatus
  });
}

async function getInternshipDemoRegistrations(req, res) {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase().slice(0, 120) : '';
    const domain = typeof req.query.domain === 'string' ? req.query.domain : '';
    const preferredDemoDay = typeof req.query.preferredDemoDay === 'string' ? req.query.preferredDemoDay : '';

    if (domain && !INTERNSHIP_DOMAINS.has(domain)) {
      return res.status(400).json({ success: false, message: 'Select a valid internship domain filter.' });
    }
    if (preferredDemoDay && !DEMO_DAYS.has(preferredDemoDay)) {
      return res.status(400).json({ success: false, message: 'Select Saturday or Sunday as the demo day filter.' });
    }

    let registrations = await Registration.find({ registrationType: 'INTERNSHIP_DEMO' });
    registrations = registrations.filter(registration => (
      (!domain || registration.selectedDomain === domain)
      && (!preferredDemoDay || registration.preferredDemoDay === preferredDemoDay)
      && (!search || [registration.fullName, registration.email, registration.mobileNumber]
        .some(value => String(value || '').toLowerCase().includes(search)))
    ));
    registrations.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

    return res.json({ success: true, count: registrations.length, registrations });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch internship demo registrations.' });
  }
}

async function updateInternshipDemoRegistrationStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ success: false, message: 'Select a valid registration status.' });
  }

  try {
    const registration = await Registration.findById(id);
    if (!registration || registration.registrationType !== 'INTERNSHIP_DEMO') {
      return res.status(404).json({ success: false, message: 'Internship demo registration not found.' });
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(id, { status });
    await logAuditAction(req.user, 'UPDATE_INTERNSHIP_DEMO_REGISTRATION', 'Internship Demo Registrations', {
      registrationId: updatedRegistration.registrationId,
      status
    });

    return res.json({ success: true, registration: updatedRegistration });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to update internship demo registration.' });
  }
}

module.exports = {
  createInternshipDemoRegistration,
  getInternshipDemoRegistrations,
  updateInternshipDemoRegistrationStatus
};
