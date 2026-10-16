const db = require('../config/db');

/**
 * Production-ready Notification Service for Pooja Sethu
 * 
 * Supports:
 * - SMS (Fast2SMS, MSG91, Twilio, Mock)
 * - WhatsApp (Meta Cloud API, Twilio WhatsApp, Gupshup, Mock)
 * - Database template interpolation (ps.notification_template)
 * - Notification audit logging (ps.notification_log)
 * 
 * Configured via .env:
 *   SMS_PROVIDER=mock (or 'fast2sms' | 'msg91' | 'twilio')
 *   SMS_API_KEY=...
 *   SMS_SENDER_ID=...
 *   WHATSAPP_PROVIDER=mock (or 'meta' | 'twilio' | 'gupshup')
 *   WHATSAPP_API_KEY=...
 *   WHATSAPP_PHONE_NUMBER_ID=...
 *   WHATSAPP_FROM=...
 * 
 * When keys are missing or provider is 'mock', it automatically runs in Mock Mode:
 *   - Compiles template placeholders
 *   - Outputs formatted log in console
 *   - Records delivery in ps.notification_log
 * Once API keys are added to .env, it switches automatically to live dispatch without code changes!
 */

// ─── 1. SMS Dispatch Provider Adapter ──────────────────────────────────────────

async function dispatchSms({ to, message }) {
  const provider = (process.env.SMS_PROVIDER || 'mock').toLowerCase().trim();
  const apiKey = process.env.SMS_API_KEY;
  const cleanPhone = String(to).replace(/[^0-9]/g, '').slice(-10);

  // If no API key or provider is mock, run in Mock Mode
  if (provider === 'mock' || !apiKey) {
    const mockRef = `mock-sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log('\n======================================================');
    console.log(`📱 [SMS DISPATCH - ${provider === 'mock' ? 'MOCK MODE' : 'KEY PENDING'}]`);
    console.log(`   To: +91 ${cleanPhone}`);
    console.log(`   Message: ${message}`);
    console.log(`   Reference: ${mockRef}`);
    console.log('======================================================\n');
    return { success: true, providerRef: mockRef, provider: 'mock' };
  }

  // 1A. Fast2SMS Integration
  if (provider === 'fast2sms') {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: cleanPhone
        })
      });
      const data = await response.json();
      const providerRef = data.request_id || `f2s-${Date.now()}`;
      return { success: data.return === true, providerRef, provider: 'fast2sms', raw: data };
    } catch (err) {
      console.error('[Fast2SMS Error]:', err.message);
      return { success: false, error: err.message, provider: 'fast2sms' };
    }
  }

  // 1B. MSG91 Integration
  if (provider === 'msg91') {
    try {
      const sender = process.env.SMS_SENDER_ID || 'POOJAS';
      const response = await fetch('https://api.msg91.com/api/v2/sendsms', {
        method: 'POST',
        headers: {
          'authkey': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: sender,
          route: '4',
          country: '91',
          sms: [{ message: message, to: [cleanPhone] }]
        })
      });
      const data = await response.json();
      return { success: data.type === 'success', providerRef: data.message, provider: 'msg91', raw: data };
    } catch (err) {
      console.error('[MSG91 Error]:', err.message);
      return { success: false, error: err.message, provider: 'msg91' };
    }
  }

  // 1C. Twilio Integration
  if (provider === 'twilio') {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = apiKey;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const bodyParams = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: fromNumber,
        Body: message
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });
      const data = await response.json();
      return { success: !data.error_code, providerRef: data.sid, provider: 'twilio', raw: data };
    } catch (err) {
      console.error('[Twilio SMS Error]:', err.message);
      return { success: false, error: err.message, provider: 'twilio' };
    }
  }

  return { success: false, error: `Unsupported SMS provider: ${provider}` };
}

// ─── 2. WhatsApp Dispatch Provider Adapter ─────────────────────────────────────

async function dispatchWhatsApp({ to, message, templateCode, variables }) {
  const provider = (process.env.WHATSAPP_PROVIDER || 'mock').toLowerCase().trim();
  const apiKey = process.env.WHATSAPP_API_KEY;
  const cleanPhone = String(to).replace(/[^0-9]/g, '').slice(-10);

  // If no API key or provider is mock, run in Mock Mode
  if (provider === 'mock' || !apiKey) {
    const mockRef = `mock-wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log('\n======================================================');
    console.log(`💬 [WHATSAPP DISPATCH - ${provider === 'mock' ? 'MOCK MODE' : 'KEY PENDING'}]`);
    console.log(`   To: +91 ${cleanPhone}`);
    console.log(`   Template: ${templateCode || 'custom'}`);
    console.log(`   Message: ${message}`);
    console.log(`   Reference: ${mockRef}`);
    console.log('======================================================\n');
    return { success: true, providerRef: mockRef, provider: 'mock' };
  }

  // 2A. Meta WhatsApp Cloud API Integration
  if (provider === 'meta') {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${cleanPhone}`,
          type: 'text',
          text: { preview_url: false, body: message }
        })
      });
      const data = await response.json();
      const providerRef = data?.messages?.[0]?.id || `meta-${Date.now()}`;
      return { success: !data.error, providerRef, provider: 'meta', raw: data };
    } catch (err) {
      console.error('[Meta WhatsApp Cloud Error]:', err.message);
      return { success: false, error: err.message, provider: 'meta' };
    }
  }

  // 2B. Twilio WhatsApp Integration
  if (provider === 'twilio') {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const fromNumber = process.env.WHATSAPP_FROM || 'whatsapp:+14155238886';
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${apiKey}`).toString('base64');

      const bodyParams = new URLSearchParams({
        To: `whatsapp:+91${cleanPhone}`,
        From: fromNumber,
        Body: message
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });
      const data = await response.json();
      return { success: !data.error_code, providerRef: data.sid, provider: 'twilio', raw: data };
    } catch (err) {
      console.error('[Twilio WhatsApp Error]:', err.message);
      return { success: false, error: err.message, provider: 'twilio' };
    }
  }

  return { success: false, error: `Unsupported WhatsApp provider: ${provider}` };
}

// ─── 3. Template Resolution & Placeholder Interpolation ────────────────────────

async function getCompiledTemplate({ code, channel, languageCode = 'en', variables = {} }) {
  let template = null;

  try {
    const res = await db.query(
      `SELECT id, code, channel, language_code, body 
       FROM ps.notification_template 
       WHERE code = $1 AND channel = $2 AND language_code = $3
       LIMIT 1`,
      [code, channel, languageCode]
    );

    if (res.rows.length > 0) {
      template = res.rows[0];
    } else {
      // Fallback to any language for this code and channel
      const fallback = await db.query(
        `SELECT id, code, channel, language_code, body 
         FROM ps.notification_template 
         WHERE code = $1 AND channel = $2
         LIMIT 1`,
        [code, channel]
      );
      if (fallback.rows.length > 0) {
        template = fallback.rows[0];
      }
    }
  } catch (err) {
    console.warn('[NotificationService] Template query warning:', err.message);
  }

  let rawBody = template?.body;
  if (!rawBody) {
    // Built-in intelligent defaults if not found in database
    if (code === 'booking_confirmed') {
      rawBody = 'Your {{pooja}} with {{purohit}} on {{date}} is confirmed. Booking ID: {{booking_no}}.';
    } else if (code === 'login_otp') {
      rawBody = 'Your Pooja Sethu verification OTP is {{otp}}. Valid for 10 minutes. Please do not share.';
    } else if (code === 'samagri_delivery') {
      rawBody = 'Your Samagri kit for {{pooja}} arrives tomorrow between 4 and 7 PM.';
    } else if (code === 'purohit_on_the_way') {
      rawBody = '{{purohit}} is on the way. Estimated arrival in {{eta}} minutes.';
    } else {
      rawBody = 'Pooja Sethu update: {{message}}';
    }
  }

  // Replace placeholders: {{key}} -> variables[key]
  let compiled = rawBody;
  for (const [key, val] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    compiled = compiled.replace(regex, String(val ?? ''));
  }

  return {
    templateId: template?.id || null,
    message: compiled
  };
}

// ─── 4. Audit Log Entry in ps.notification_log ────────────────────────────────

async function logNotification({
  templateId,
  recipientType = 'customer',
  recipientId,
  bookingId = null,
  channel,
  status = 'sent',
  providerRef = null
}) {
  try {
    // If recipientId is not a valid UUID, find or fallback to customer UUID
    let resolvedRecipientId = recipientId;
    if (!resolvedRecipientId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(resolvedRecipientId))) {
      const uRes = await db.query('SELECT id FROM ps.app_user LIMIT 1');
      resolvedRecipientId = uRes.rows[0]?.id;
    }

    if (!resolvedRecipientId) {
      return null;
    }

    const res = await db.query(
      `INSERT INTO ps.notification_log 
       (template_id, recipient_type, recipient_id, booking_id, channel, status, provider_ref, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id`,
      [
        templateId,
        recipientType,
        resolvedRecipientId,
        bookingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(bookingId)) ? bookingId : null,
        channel,
        status,
        providerRef
      ]
    );

    return res.rows[0]?.id;
  } catch (err) {
    console.warn('[NotificationService] Audit log insert warning:', err.message);
    return null;
  }
}

// ─── 5. High-Level Dispatch Functions ─────────────────────────────────────────

/**
 * Send Booking Confirmation via BOTH WhatsApp and SMS
 */
async function sendBookingConfirmation({
  userId,
  phone,
  bookingId,
  bookingNo,
  poojaName,
  purohitName,
  date,
  languageCode = 'en'
}) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
  const vars = {
    pooja: poojaName || 'Pooja Ceremony',
    purohit: purohitName || 'Purohit',
    date: date || 'Selected Date',
    booking_no: bookingNo || 'PS-26-BOOKING'
  };

  const results = { whatsapp: null, sms: null };

  // 1. WhatsApp Confirmation
  try {
    const wa = await getCompiledTemplate({
      code: 'booking_confirmed',
      channel: 'whatsapp',
      languageCode,
      variables: vars
    });

    const waDispatch = await dispatchWhatsApp({
      to: cleanPhone,
      message: wa.message,
      templateCode: 'booking_confirmed',
      variables: vars
    });

    await logNotification({
      templateId: wa.templateId,
      recipientType: 'customer',
      recipientId: userId,
      bookingId,
      channel: 'whatsapp',
      status: waDispatch.success ? 'delivered' : 'failed',
      providerRef: waDispatch.providerRef
    });

    results.whatsapp = waDispatch;
  } catch (waErr) {
    console.error('[NotificationService] WhatsApp booking confirmation error:', waErr.message);
  }

  // 2. SMS Confirmation
  try {
    const sms = await getCompiledTemplate({
      code: 'booking_confirmed',
      channel: 'sms',
      languageCode,
      variables: vars
    });

    const smsDispatch = await dispatchSms({
      to: cleanPhone,
      message: sms.message
    });

    await logNotification({
      templateId: sms.templateId,
      recipientType: 'customer',
      recipientId: userId,
      bookingId,
      channel: 'sms',
      status: smsDispatch.success ? 'sent' : 'failed',
      providerRef: smsDispatch.providerRef
    });

    results.sms = smsDispatch;
  } catch (smsErr) {
    console.error('[NotificationService] SMS booking confirmation error:', smsErr.message);
  }

  return results;
}

/**
 * Send Login / Verification OTP via SMS
 */
async function sendOtpSms({ phone, otp }) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
  const vars = { otp };

  const sms = await getCompiledTemplate({
    code: 'login_otp',
    channel: 'sms',
    languageCode: 'en',
    variables: vars
  });

  const dispatchResult = await dispatchSms({
    to: cleanPhone,
    message: sms.message
  });

  return dispatchResult;
}

/**
 * Send Samagri Kit update
 */
async function sendSamagriUpdate({ userId, phone, bookingId, poojaName, languageCode = 'en' }) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
  const vars = { pooja: poojaName || 'Pooja Ceremony' };

  const sms = await getCompiledTemplate({
    code: 'samagri_delivery',
    channel: 'sms',
    languageCode,
    variables: vars
  });

  const dispatchResult = await dispatchSms({
    to: cleanPhone,
    message: sms.message
  });

  await logNotification({
    templateId: sms.templateId,
    recipientType: 'customer',
    recipientId: userId,
    bookingId,
    channel: 'sms',
    status: dispatchResult.success ? 'sent' : 'failed',
    providerRef: dispatchResult.providerRef
  });

  return dispatchResult;
}

module.exports = {
  dispatchSms,
  dispatchWhatsApp,
  sendBookingConfirmation,
  sendOtpSms,
  sendSamagriUpdate,
  getCompiledTemplate,
  logNotification
};
