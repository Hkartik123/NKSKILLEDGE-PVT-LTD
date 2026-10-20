const RECIPIENT = '917498784109';

function getWhatsAppConfiguration(environment = process.env) {
  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_TEMPLATE_NAME',
    'WHATSAPP_TEMPLATE_LANGUAGE',
    'WHATSAPP_GRAPH_API_VERSION'
  ];
  const missing = required.filter(name => !environment[name]);

  if (missing.length) {
    return { configured: false, missing };
  }

  if (!/^v\d+\.\d+$/.test(environment.WHATSAPP_GRAPH_API_VERSION)) {
    return { configured: false, missing: ['WHATSAPP_GRAPH_API_VERSION'] };
  }

  return { configured: true, missing: [] };
}

async function sendInternshipDemoWhatsAppNotification(registration, {
  environment = process.env,
  fetchImpl = fetch
} = {}) {
  const configuration = getWhatsAppConfiguration(environment);
  if (!configuration.configured) {
    return { status: 'NOT_CONFIGURED' };
  }

  const bodyParameters = [
    registration.fullName,
    registration.mobileNumber,
    registration.email,
    registration.collegeName,
    registration.educationLevel,
    registration.selectedDomain,
    registration.preferredDemoDay,
    registration.city || 'Not provided',
    registration.registrationId,
    'PENDING CONFIRMATION'
  ];

  try {
    const response = await fetchImpl(
      `https://graph.facebook.com/${environment.WHATSAPP_GRAPH_API_VERSION}/${environment.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${environment.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: RECIPIENT,
          type: 'template',
          template: {
            name: environment.WHATSAPP_TEMPLATE_NAME,
            language: { code: environment.WHATSAPP_TEMPLATE_LANGUAGE },
            components: [{
              type: 'body',
              parameters: bodyParameters.map(text => ({ type: 'text', text: String(text) }))
            }]
          }
        })
      }
    );

    if (!response.ok) {
      return { status: 'FAILED' };
    }

    const result = await response.json();
    if (!result.messages?.[0]?.id) {
      return { status: 'FAILED' };
    }

    return { status: 'ACCEPTED', providerMessageId: result.messages[0].id };
  } catch {
    return { status: 'FAILED' };
  }
}

function getReservationWhatsAppConfiguration(environment = process.env) {
  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_GRAPH_API_VERSION',
    'RESERVATION_WHATSAPP_TEMPLATE_NAME',
    'RESERVATION_WHATSAPP_TEMPLATE_LANGUAGE'
  ];
  const missing = required.filter(name => !environment[name]);

  if (missing.length) {
    return { configured: false, missing };
  }

  if (!/^v\d+\.\d+$/.test(environment.WHATSAPP_GRAPH_API_VERSION)) {
    return { configured: false, missing: ['WHATSAPP_GRAPH_API_VERSION'] };
  }

  return { configured: true, missing: [] };
}

function normalizeWhatsAppRecipient(mobileNumber) {
  const digits = String(mobileNumber || '').replace(/\D/g, '');
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;
  return '';
}

function buildReservationWelcomeMessage(registration) {
  return `Hi ${registration.fullName}, your ₹${registration.paymentAmount || 1000} reservation payment for ${registration.programName} has been verified. Welcome to NKSKILLEDGE! Your Reservation ID is ${registration.registrationId}. Our team will contact you with next steps.`;
}

async function sendReservationWelcomeWhatsApp(registration, {
  environment = process.env,
  fetchImpl = fetch
} = {}) {
  const configuration = getReservationWhatsAppConfiguration(environment);
  if (!configuration.configured) {
    return { status: 'NOT_CONFIGURED' };
  }

  const recipient = normalizeWhatsAppRecipient(registration.mobileNumber);
  if (!recipient || !registration.registrationId || registration.paymentStatus !== 'Paid') {
    return { status: 'FAILED', errorCode: 'INVALID_RESERVATION' };
  }

  const bodyParameters = [
    registration.fullName,
    String(registration.paymentAmount || 1000),
    registration.programName,
    registration.registrationId
  ];

  try {
    const response = await fetchImpl(
      `https://graph.facebook.com/${environment.WHATSAPP_GRAPH_API_VERSION}/${environment.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${environment.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'template',
          template: {
            name: environment.RESERVATION_WHATSAPP_TEMPLATE_NAME,
            language: { code: environment.RESERVATION_WHATSAPP_TEMPLATE_LANGUAGE },
            components: [{
              type: 'body',
              parameters: bodyParameters.map(text => ({ type: 'text', text: String(text) }))
            }]
          }
        })
      }
    );

    if (!response.ok) {
      return { status: 'FAILED', errorCode: `HTTP_${response.status}` };
    }

    const result = await response.json();
    if (!result.messages?.[0]?.id) {
      return { status: 'FAILED', errorCode: 'MISSING_PROVIDER_MESSAGE_ID' };
    }

    return { status: 'ACCEPTED', providerMessageId: result.messages[0].id };
  } catch (error) {
    console.error('Reservation WhatsApp dispatch failed:', error.name || 'RequestError');
    return { status: 'FAILED', errorCode: 'NETWORK_ERROR' };
  }
}

module.exports = {
  getWhatsAppConfiguration,
  sendInternshipDemoWhatsAppNotification,
  getReservationWhatsAppConfiguration,
  buildReservationWelcomeMessage,
  sendReservationWelcomeWhatsApp
};
