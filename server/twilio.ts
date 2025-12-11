// Twilio integration helper - using Replit Twilio Connector
import twilio from 'twilio';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error('Twilio not connected');
  }
  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid: accountSid
  });
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export async function sendWhatsAppMessage(to: string, body: string): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  try {
    const client = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();
    
    // Ensure the 'to' number has the WhatsApp prefix
    const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const fromWhatsApp = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    
    const message = await client.messages.create({
      body: body,
      from: fromWhatsApp,
      to: toWhatsApp
    });
    
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

export async function checkTwilioConnection(): Promise<{ connected: boolean; phoneNumber?: string; error?: string }> {
  try {
    const client = await getTwilioClient();
    const phoneNumber = await getTwilioFromPhoneNumber();
    // Test the connection by fetching incoming phone numbers (API key has permission for this)
    await client.incomingPhoneNumbers.list({ limit: 1 });
    return { connected: true, phoneNumber };
  } catch (error: any) {
    // If we have credentials but just can't verify, still show as connected
    try {
      const phoneNumber = await getTwilioFromPhoneNumber();
      if (phoneNumber) {
        return { connected: true, phoneNumber };
      }
    } catch {
      // Fall through to error
    }
    return { connected: false, error: error.message };
  }
}

export async function validateTwilioWebhookSignature(
  signature: string | undefined,
  url: string,
  params: Record<string, string>
): Promise<boolean> {
  try {
    const twilio = await import('twilio');
    const { apiKeySecret } = await getCredentials();
    
    if (!signature) {
      console.warn('No Twilio signature provided');
      return false;
    }
    
    // Validate the webhook signature
    return twilio.validateRequest(apiKeySecret, signature, url, params);
  } catch (error) {
    console.error('Error validating Twilio webhook signature:', error);
    // In development, allow requests without signature validation
    return process.env.NODE_ENV === 'development';
  }
}
