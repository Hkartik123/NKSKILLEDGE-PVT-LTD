const crypto = require('crypto');
const { Registration } = require('../models');
const { sendRegistrationConfirmation } = require('../services/emailService');
const { logAuditAction, createNotification } = require('../services/auditService');
const {
  buildReservationWelcomeMessage,
  sendReservationWelcomeWhatsApp
} = require('../services/whatsappService');

function generateRegistrationId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `NKSK-TR-${year}-${random}`;
}

async function generateReservationId() {
  let reservationId;
  do {
    reservationId = `NKSK-RES-${new Date().getFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  } while (await Registration.findOne({ registrationId: reservationId }));
  return reservationId;
}

async function dispatchReservationWelcome(registrationId) {
  const registration = await Registration.findById(registrationId);
  if (!registration || registration.registrationType !== 'SEAT_RESERVATION') {
    throw new Error('Seat reservation was not found for WhatsApp delivery.');
  }

  if (registration.whatsappOptIn !== true) {
    return Registration.findByIdAndUpdate(registrationId, {
      whatsappWelcomeStatus: 'NOT_OPTED_IN'
    });
  }

  const message = buildReservationWelcomeMessage(registration);
  const result = await sendReservationWelcomeWhatsApp(registration);
  const updates = {
    whatsappWelcomeMessage: message,
    whatsappWelcomeStatus: result.status,
    whatsappWelcomeAttemptedAt: new Date().toISOString(),
    whatsappWelcomeErrorCode: result.errorCode || null,
    ...(result.status === 'ACCEPTED'
      ? {
          whatsappWelcomeSentAt: new Date().toISOString(),
          whatsappWelcomeProviderMessageId: result.providerMessageId
        }
      : {})
  };
  const updated = await Registration.findByIdAndUpdate(registrationId, updates);

  if (result.status === 'FAILED') {
    console.error('Reservation welcome message was not accepted by WhatsApp:', result.errorCode || 'UNKNOWN_ERROR');
  }

  await createNotification(
    'Seat reservation payment verified',
    `${registration.fullName}'s payment for ${registration.programName} was verified. WhatsApp welcome message: ${result.status}.`,
    'registration',
    '/admin/registrations'
  );

  return updated;
}

async function createRegistration(req, res) {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      college,
      course,
      branch,
      yearOrSemester,
      preferredBatch,
      trainingMode,
      city,
      programName,
      message
    } = req.body;

    if (!fullName || !mobileNumber || !email) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and mobile number.' });
    }

    const registrationId = generateRegistrationId();

    const reg = await Registration.create({
      registrationId,
      fullName,
      email,
      mobileNumber,
      college: college || 'Not Specified',
      course: course || 'Engineering / BCA / Diploma',
      branch: branch || 'Computer Science / IT',
      yearOrSemester: yearOrSemester || 'Final Year',
      preferredBatch: preferredBatch || 'Upcoming Batch',
      trainingMode: trainingMode || 'Offline (Sakoli Lab)',
      city: city || 'Sakoli',
      programName: programName || 'Industrial Training Program',
      message: message || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      notes: []
    });

    await sendRegistrationConfirmation(reg);

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      registrationId: reg.registrationId,
      registration: reg
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process registration.' });
  }
}

async function getRegistrations(req, res) {
  try {
    const { status, program } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (program && program !== 'All') query.programName = program;

    let list = await Registration.find(query);
    list = list.filter(registration => registration.registrationType !== 'INTERNSHIP_DEMO');
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, count: list.length, registrations: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
  }
}

async function updateRegistrationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, paymentStatus, note } = req.body;

    const reg = await Registration.findById(id);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    const updates = {};
    if (reg.registrationType === 'SEAT_RESERVATION') {
      const allowedPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
      const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled'];

      if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid reservation payment status.' });
      }
      if (
        reg.paymentStatus === 'Refunded' ||
        (reg.paymentStatus === 'Paid' && paymentStatus && paymentStatus !== 'Refunded')
      ) {
        return res.status(409).json({ success: false, message: 'This reservation payment can no longer be changed.' });
      }
      if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid reservation status.' });
      }
      if (status === 'Confirmed' && reg.paymentStatus !== 'Paid' && paymentStatus !== 'Paid') {
        return res.status(409).json({ success: false, message: 'Verify the reservation payment before confirming the seat.' });
      }
      if (paymentStatus === 'Paid') {
        if (req.body.paymentVerified !== true) {
          return res.status(400).json({ success: false, message: 'Confirm that this payment was checked against the provider or bank records.' });
        }
        if (!reg.transactionId) {
          return res.status(400).json({ success: false, message: 'A transaction reference is required before verifying payment.' });
        }

        updates.paymentStatus = 'Paid';
        updates.registrationId = reg.registrationId || await generateReservationId();
        updates.status = 'Confirmed';
        updates.reservationStatus = 'Confirmed';
        updates.paymentVerifiedAt = new Date().toISOString();
        updates.paymentVerifiedBy = req.user.name || req.user.email;
        updates.whatsappWelcomeStatus = reg.whatsappOptIn === true ? 'SENDING' : 'NOT_OPTED_IN';
      } else if (paymentStatus) {
        updates.paymentStatus = paymentStatus;
        updates.reservationStatus = paymentStatus === 'Refunded'
          ? 'Refunded'
          : paymentStatus === 'Failed'
            ? 'Payment failed'
            : 'Awaiting payment verification';
        if (paymentStatus === 'Refunded') updates.status = 'Cancelled';
      }

      if (status && status !== 'Confirmed') {
        updates.status = status;
        if (status === 'Cancelled') updates.reservationStatus = 'Cancelled';
      }
    } else {
      if (status) updates.status = status;
      if (paymentStatus) updates.paymentStatus = paymentStatus;
    }
    if (note) {
      const notes = reg.notes || [];
      notes.push({
        text: note,
        addedBy: req.user.name,
        date: new Date().toISOString()
      });
      updates.notes = notes;
    }

    let updated = await Registration.findByIdAndUpdate(id, updates);
    if (reg.registrationType === 'SEAT_RESERVATION' && paymentStatus === 'Paid') {
      updated = await dispatchReservationWelcome(id);
    }
    await logAuditAction(req.user, 'UPDATE_REGISTRATION', 'Registrations', {
      regId: id,
      status: updated.status,
      paymentStatus: updated.paymentStatus
    });

    return res.json({ success: true, message: 'Registration updated', registration: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update registration.' });
  }
}

async function retryReservationWelcomeMessage(req, res) {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration || registration.registrationType !== 'SEAT_RESERVATION') {
      return res.status(404).json({ success: false, message: 'Seat reservation not found.' });
    }
    if (registration.paymentStatus !== 'Paid') {
      return res.status(409).json({ success: false, message: 'Verify payment before sending the welcome message.' });
    }
    if (registration.whatsappOptIn !== true) {
      return res.status(409).json({ success: false, message: 'The student has not opted in to WhatsApp messages.' });
    }
    if (registration.whatsappWelcomeStatus === 'ACCEPTED') {
      return res.status(409).json({ success: false, message: 'WhatsApp has already accepted the welcome message.' });
    }
    if (registration.whatsappWelcomeStatus === 'SENDING') {
      return res.status(409).json({ success: false, message: 'The welcome message is already being sent.' });
    }

    await Registration.findByIdAndUpdate(registration._id, {
      whatsappWelcomeStatus: 'SENDING',
      whatsappWelcomeErrorCode: null
    });
    const updated = await dispatchReservationWelcome(registration._id);
    await logAuditAction(req.user, 'RETRY_RESERVATION_WELCOME', 'Registrations', {
      regId: registration._id,
      whatsappWelcomeStatus: updated.whatsappWelcomeStatus
    });

    return res.json({
      success: true,
      message: updated.whatsappWelcomeStatus === 'ACCEPTED'
        ? 'WhatsApp accepted the welcome message.'
        : 'WhatsApp did not accept the welcome message. Check its status and configuration.',
      registration: updated
    });
  } catch (err) {
    console.error('Reservation welcome message retry failed:', err);
    return res.status(500).json({ success: false, message: 'Unable to retry the reservation welcome message.' });
  }
}

module.exports = {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
  retryReservationWelcomeMessage
};
