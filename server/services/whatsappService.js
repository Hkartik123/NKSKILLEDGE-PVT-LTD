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

module.exports = {
  getWhatsAppConfiguration,
  sendInternshipDemoWhatsAppNotification
};
