import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock3, GraduationCap, LockKeyhole,
  QrCode, ShieldCheck, Smartphone, WalletCards
} from 'lucide-react';
import './SeatReservation.css';

const RESERVATION_AMOUNT = 1000;

function getTrackingIdFromUrl() {
  return new URLSearchParams(window.location.search).get('reservation') || '';
}

function createSubmissionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  throw new Error('This browser cannot securely start a seat request. Please use an up-to-date browser.');
}

export default function SeatReservation({ programs = [] }) {
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    programName: '',
    trainingMode: 'Online',
    whatsappOptIn: false
  });
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [referenceSubmitting, setReferenceSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [submissionId] = useState(createSubmissionId);

  const courseOptions = useMemo(() => {
    const names = programs
      .map(program => program.name || program.title)
      .filter(name => typeof name === 'string' && name.trim());
    return [...new Set([
      ...names,
      'Industrial Training Program',
      'Full Stack Web Development',
      'Cyber Security Training',
      'Mobile App Development',
      'AI & Machine Learning',
      'Internet of Things (IoT)'
    ])];
  }, [programs]);

  useEffect(() => {
    let active = true;
    fetch('/api/reservations/payment-config')
      .then(async response => {
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load payment options.');
        if (active) setPaymentConfig(data.payment);
      })
      .catch(() => {
        if (active) {
          setPaymentConfig({
            configured: false,
            upiId: '',
            payeeName: '',
            error: 'Payment options could not be loaded. Payment has been disabled for your safety.'
          });
        }
      });

    const trackingId = getTrackingIdFromUrl();
    if (trackingId) {
      setStatusLoading(true);
      fetch(`/api/reservations/${encodeURIComponent(trackingId)}`)
        .then(async response => {
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error(data.message || 'Unable to find this seat request.');
          if (active) setReservation(data.reservation);
        })
        .catch(requestError => {
          if (active) setError(requestError.message);
        })
        .finally(() => {
          if (active) setStatusLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, []);

  const updateField = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submissionId, transactionId })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to save your seat request.');
      }

      setReservation(data.reservation);
      const url = new URL(window.location.href);
      url.searchParams.set('reservation', data.reservation.trackingId);
      window.history.replaceState({}, '', url);
      setNotice('Your details are saved. Your seat is not confirmed until payment is verified.');
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReferenceSubmit = async event => {
    event.preventDefault();
    if (!reservation?.trackingId || referenceSubmitting) return;
    setReferenceSubmitting(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`/api/reservations/${encodeURIComponent(reservation.trackingId)}/payment-reference`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit the transaction reference.');
      }
      setReservation(data.reservation);
      setNotice('Transaction reference submitted. NKSKILLEDGE will verify it before confirming your seat.');
    } catch (requestError) {
      setError(requestError.message || 'Unable to submit the transaction reference.');
    } finally {
      setReferenceSubmitting(false);
    }
  };

  const paymentLink = reservation && paymentConfig?.configured
    ? `upi://pay?${new URLSearchParams({
      pa: paymentConfig.upiId,
      pn: paymentConfig.payeeName,
      am: String(RESERVATION_AMOUNT),
      cu: 'INR',
      tn: `Seat reservation ${reservation.trackingId}`
    }).toString()}`
    : '';

  return (
    <section className="seat-reservation-page">
      <div className="seat-reservation-container">
        <a className="seat-home-link" href="/#home">
          <ArrowLeft size={16} /> Back to NKSKILLEDGE
        </a>

        <div className="seat-page-heading">
          <span className="seat-eyebrow"><GraduationCap size={15} /> NKSKILLEDGE PRIVATE LIMITED</span>
          <h1>Reserve Your <span>Seat</span></h1>
          <p>Take the next step toward building your technical skills with NKSKILLEDGE Private Limited.</p>
        </div>

        {error && <div className="seat-alert seat-alert-error" role="alert">{error}</div>}
        {notice && <div className="seat-alert seat-alert-info" role="status">{notice}</div>}

        {statusLoading ? (
          <div className="seat-status-card"><Clock3 size={22} /> Checking your reservation status…</div>
        ) : reservation?.registrationId ? (
          <div className="seat-confirmation-card">
            <div className="seat-confirmation-icon"><CheckCircle2 size={34} /></div>
            <span className="seat-eyebrow">PAYMENT VERIFIED</span>
            <h2>Your seat is confirmed</h2>
            <p>Your reservation advance has been verified by the NKSKILLEDGE team.</p>
            <div className="seat-reservation-id">
              <span>Reservation ID</span>
              <strong>{reservation.registrationId}</strong>
            </div>
            <p className="seat-confirmation-note">Save this ID for future communication about your program.</p>
          </div>
        ) : reservation ? (
          <div className="seat-pending-card">
            <div className="seat-pending-icon"><Clock3 size={28} /></div>
            <span className="seat-eyebrow">PAYMENT STATUS: {reservation.paymentStatus}</span>
            <h2>We’re verifying your payment</h2>
            <p>Your seat request is saved, but your reservation is not confirmed yet. We’ll confirm it after the payment is verified.</p>
            <div className="seat-tracking-id">
              <span>Request reference</span>
              <strong>{reservation.trackingId}</strong>
            </div>
            <div className="seat-pending-payment">
              <strong>Reservation advance: ₹1,000</strong>
              <p>Scan the official UPI QR code below and enter exactly ₹1,000. Your seat remains pending until NKSKILLEDGE verifies the transaction.</p>
              <a className="seat-reservation-qr-link" href="/seat-payment-qr.png" target="_blank" rel="noreferrer">
                <img
                  className="seat-reservation-qr"
                  src="/seat-payment-qr.png"
                  alt="Official NKSKILLEDGE UPI payment QR code"
                />
                <span>Open full-size QR code</span>
              </a>
              <a
                className="seat-pay-button"
                href={paymentLink || '/seat-payment-qr.png'}
                rel={paymentLink ? undefined : 'noreferrer'}
                target={paymentLink ? undefined : '_blank'}
              >
                <WalletCards size={18} />
                {paymentLink ? 'Pay ₹1,000 & Reserve My Seat' : 'Open QR to pay ₹1,000'}
              </a>
              {!paymentConfig?.configured && (
                <p className="seat-payment-next-step">
                  Payee / amount are not auto-filled. Verify the payee in your UPI app and enter ₹1,000 before authorizing.
                </p>
              )}
              <form className="seat-reference-form" onSubmit={handleReferenceSubmit}>
                <label className="seat-field">
                  <span>Already paid? Add your UPI transaction reference</span>
                  <input
                    autoComplete="off"
                    maxLength={120}
                    onChange={event => setTransactionId(event.target.value)}
                    placeholder="Reference from your UPI app"
                    required
                    value={transactionId}
                  />
                </label>
                <button className="seat-reference-button" disabled={referenceSubmitting} type="submit">
                  {referenceSubmitting ? 'Submitting…' : 'Submit for verification'}
                </button>
              </form>
            </div>
            <a className="seat-refresh-link" href={`/reserve-seat?reservation=${encodeURIComponent(reservation.trackingId)}`}>
              Refresh status <ArrowRight size={15} />
            </a>
          </div>
        ) : (
          <div className="seat-booking-grid">
            <form className="seat-form-card" onSubmit={handleSubmit}>
              <div className="seat-card-heading">
                <div>
                  <span className="seat-step-label">01 / YOUR DETAILS</span>
                  <h2>Student information</h2>
                </div>
                <ShieldCheck size={21} />
              </div>

              <div className="seat-form-grid">
                <label className="seat-field seat-field-full">
                  <span>Full name <b>*</b></span>
                  <input
                    autoComplete="name"
                    maxLength={120}
                    name="fullName"
                    onChange={updateField}
                    placeholder="Enter your full name"
                    required
                    value={form.fullName}
                  />
                </label>

                <label className="seat-field">
                  <span>Mobile / WhatsApp number <b>*</b></span>
                  <input
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={16}
                    name="mobileNumber"
                    onChange={updateField}
                    pattern="(?:\+91(?:\s|-)?)?[6-9][0-9]{9}"
                    placeholder="10-digit mobile number"
                    required
                    title="Enter a valid 10-digit Indian mobile number."
                    value={form.mobileNumber}
                  />
                </label>

                <label className="seat-field">
                  <span>Email address <small>OPTIONAL</small></span>
                  <input
                    autoComplete="email"
                    maxLength={254}
                    name="email"
                    onChange={updateField}
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                  />
                </label>

                <label className="seat-field seat-field-full">
                  <span>Select course / program <b>*</b></span>
                  <select name="programName" onChange={updateField} required value={form.programName}>
                    <option value="" disabled>Select a training program</option>
                    {courseOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </label>

                <fieldset className="seat-field seat-mode-field seat-field-full">
                  <legend>Preferred learning mode <b>*</b></legend>
                  <div className="seat-mode-options">
                    {['Online', 'Offline'].map(mode => (
                      <label className={`seat-mode-option ${form.trainingMode === mode ? 'is-selected' : ''}`} key={mode}>
                        <input
                          checked={form.trainingMode === mode}
                          name="trainingMode"
                          onChange={updateField}
                          type="radio"
                          value={mode}
                        />
                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="seat-whatsapp-consent seat-field-full">
                  <input
                    checked={form.whatsappOptIn}
                    name="whatsappOptIn"
                    onChange={event => setForm(current => ({ ...current, whatsappOptIn: event.target.checked }))}
                    required
                    type="checkbox"
                  />
                  <span>I agree to receive my payment confirmation and reservation welcome message on WhatsApp at the mobile number above.</span>
                </label>

                <label className="seat-field seat-field-full">
                  <span>UPI transaction reference <small>OPTIONAL UNTIL YOU PAY</small></span>
                  <input
                    autoComplete="off"
                    maxLength={120}
                    name="transactionId"
                    onChange={event => setTransactionId(event.target.value)}
                    placeholder="Enter the reference from your UPI app"
                    value={transactionId}
                  />
                  <small className="seat-field-hint">Never enter a UPI PIN, card PIN, password, or OTP.</small>
                </label>
              </div>

              <div className="seat-terms-notice">
                <LockKeyhole size={17} />
                <p><strong>Payment &amp; refund terms:</strong> ₹1,000 is an advance toward your program. Your seat is confirmed only after payment verification. Refund eligibility and timelines must be confirmed by NKSKILLEDGE before payment; contact the team to review them first.</p>
              </div>

              <button className="seat-submit-button" disabled={submitting} type="submit">
                {submitting ? 'Saving your request…' : 'Save details & continue'}
                {!submitting && <ArrowRight size={17} />}
              </button>
              <p className="seat-form-footnote"><LockKeyhole size={13} /> Your details are sent securely to NKSKILLEDGE.</p>
            </form>

            <aside className="seat-payment-card">
              <span className="seat-step-label">02 / RESERVATION ADVANCE</span>
              <h2>Secure your next step</h2>
              <p className="seat-payment-intro">A small advance to get started with your chosen program.</p>

              <div className="seat-amount-panel">
                <span>Seat reservation advance</span>
                <strong><small>₹</small>1,000</strong>
                <span className="seat-amount-caption">One-time payment · INR</span>
              </div>

              <div className="seat-payment-method">
                <div className="seat-qr-placeholder">
                  <QrCode size={34} />
                </div>
                <div>
                  <strong>Official UPI QR code</strong>
                  <p>Save your details to open the NKSKILLEDGE payment QR code.</p>
                </div>
              </div>

              <button className="seat-pay-button" disabled type="button">
                <WalletCards size={18} /> Pay ₹1,000 &amp; Reserve My Seat
              </button>
              {paymentConfig?.configured && (
                <p className="seat-payment-next-step">Save your details first to create a tracked payment request.</p>
              )}

              <div className="seat-trust-list">
                <span><ShieldCheck size={15} /> Payment verified before confirmation</span>
                <span><LockKeyhole size={15} /> No PINs or card credentials collected</span>
                <span><Smartphone size={15} /> Questions? Contact our team before paying</span>
              </div>
              <p className="seat-refund-note">Refund terms for this reservation have not been published here. Confirm eligibility and timelines with our team before payment.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
