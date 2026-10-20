const crypto = require('crypto');
const { Registration } = require('../models');

const RESERVATION_AMOUNT = 1000;

function normalizeMobileNumber(value) {
  return String(value || '').replace(/[\s()-]/g, '');
}

function isValidIndianMobileNumber(value) {
  return /^(?:\+91)?[6-9]\d{9}$/.test(value);
}

function getPaymentDetails() {
  const upiId = process.env.RESERVATION_UPI_ID || '';
  const payeeName = process.env.RESERVATION_PAYEE_NAME || 'NKSKILLEDGE Private Limited';

  return {
    configured: Boolean(upiId && payeeName),
    upiId,
    payeeName
  };
}

function getPaymentConfiguration(req, res) {
  return res.json({ success: true, payment: getPaymentDetails() });
}

async function createReservation(req, res) {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const {
      submissionId,
      fullName,
      mobileNumber,
      email,
      programName,
      trainingMode,
      transactionId
    } = body;

    if (
      typeof submissionId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)
    ) {
      return res.status(400).json({ success: false, message: 'Please refresh the page and try again.' });
    }

    const existingSubmission = await Registration.findOne({
      registrationType: 'SEAT_RESERVATION',
      submissionId
    });
    if (existingSubmission) {
      return res.status(200).json({
        success: true,
        reservation: {
          trackingId: existingSubmission.trackingId,
          status: existingSubmission.reservationStatus,
          paymentStatus: existingSubmission.paymentStatus,
          registrationId: existingSubmission.registrationId || null
        }
      });
    }

    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      fullName.trim().length > 120 ||
      !isValidIndianMobileNumber(normalizedMobile) ||
      typeof programName !== 'string' ||
      !programName.trim() ||
      programName.trim().length > 160 ||
      !['Online', 'Offline'].includes(trainingMode)
    ) {
      return res.status(400).json({ success: false, message: 'Please check the required fields and mobile number.' });
    }

    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    if (normalizedEmail && (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const normalizedTransactionId = typeof transactionId === 'string' ? transactionId.trim() : '';
    if (normalizedTransactionId.length > 120) {
      return res.status(400).json({ success: false, message: 'The transaction reference is too long.' });
    }

    const mobileForComparison = normalizedMobile.replace(/^\+91/, '');
    const existingReservations = await Registration.find({ registrationType: 'SEAT_RESERVATION' });
    const duplicate = existingReservations.find(registration =>
      String(registration.mobileNumber || '').replace(/^\+91/, '') === mobileForComparison &&
      registration.reservationStatus !== 'Cancelled'
    );
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'A seat request already exists for this mobile number. Please contact NKSKILLEDGE for help.'
      });
    }

    const trackingId = crypto.randomUUID();
    const registration = await Registration.create({
      registrationType: 'SEAT_RESERVATION',
      submissionId,
      trackingId,
      registrationId: null,
      fullName: fullName.trim(),
      mobileNumber: normalizedMobile,
      email: normalizedEmail,
      programName: programName.trim(),
      trainingMode,
      college: 'Not provided',
      course: 'Seat Reservation',
      branch: 'Not provided',
      yearOrSemester: 'Not provided',
      preferredBatch: 'Upcoming Batch',
      city: 'Not provided',
      paymentAmount: RESERVATION_AMOUNT,
      transactionId: normalizedTransactionId,
      paymentStatus: 'Pending',
      reservationStatus: 'Awaiting payment verification',
      status: 'Pending',
      notes: []
    });

    return res.status(201).json({
      success: true,
      reservation: {
        trackingId: registration.trackingId,
        status: registration.reservationStatus,
        paymentStatus: registration.paymentStatus,
        registrationId: null
      }
    });
  } catch (err) {
    console.error('Seat reservation error:', err);
    return res.status(500).json({ success: false, message: 'Unable to save your seat request. Please try again.' });
  }
}

async function getReservationStatus(req, res) {
  try {
    const reservation = await Registration.findOne({
      registrationType: 'SEAT_RESERVATION',
      trackingId: req.params.trackingId
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Seat request not found.' });
    }

    return res.json({
      success: true,
      reservation: {
        trackingId: reservation.trackingId,
        status: reservation.reservationStatus,
        paymentStatus: reservation.paymentStatus,
        registrationId: reservation.registrationId || null
      }
    });
  } catch (err) {
    console.error('Seat reservation status error:', err);
    return res.status(500).json({ success: false, message: 'Unable to check your seat request status.' });
  }
}

async function updatePaymentReference(req, res) {
  try {
    const transactionId = typeof req.body.transactionId === 'string'
      ? req.body.transactionId.trim()
      : '';
    if (!transactionId || transactionId.length > 120) {
      return res.status(400).json({ success: false, message: 'Enter a valid UPI transaction reference.' });
    }

    const reservation = await Registration.findOne({
      registrationType: 'SEAT_RESERVATION',
      trackingId: req.params.trackingId
    });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Seat request not found.' });
    }
    if (reservation.paymentStatus === 'Paid' || reservation.paymentStatus === 'Refunded') {
      return res.status(409).json({ success: false, message: 'This payment record can no longer be changed.' });
    }

    const updated = await Registration.findByIdAndUpdate(reservation._id, {
      transactionId,
      paymentStatus: 'Pending',
      reservationStatus: 'Awaiting payment verification'
    });

    return res.json({
      success: true,
      reservation: {
        trackingId: updated.trackingId,
        status: updated.reservationStatus,
        paymentStatus: updated.paymentStatus,
        registrationId: updated.registrationId || null
      }
    });
  } catch (err) {
    console.error('Seat reservation payment reference error:', err);
    return res.status(500).json({ success: false, message: 'Unable to submit the transaction reference.' });
  }
}

module.exports = {
  createReservation,
  getPaymentConfiguration,
  getReservationStatus,
  updatePaymentReference
};
