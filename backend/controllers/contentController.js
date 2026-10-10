const db = require('../config/db');

// Hardcoded fallback content in case the DB table doesn't exist yet
const fallbackContent = {
  terms: `Terms & Conditions

1. Acceptance of Terms
By using Pooja Sethu, you agree to these terms. If you do not agree, please do not use the app.

2. Services
Pooja Sethu connects devotees with qualified Purohits for religious services. We act as an intermediary platform and are not directly responsible for the Purohit's conduct.

3. Bookings & Payments
All bookings are confirmed only after payment. The platform fee and GST are non-refundable.

4. User Responsibilities
You must provide accurate information during registration and booking. Misuse of the platform may result in account termination.

5. Modifications
We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.

Contact: support@poojasetu.com`,

  privacy: `Privacy Policy

1. Information We Collect
We collect your mobile number, name, email, address, family details, and booking history to provide our services.

2. How We Use Your Information
Your information is used to facilitate bookings, send notifications, and improve our services. We do not sell your data to third parties.

3. Data Security
We use industry-standard encryption and security practices to protect your data.

4. Cookies
Our web app uses cookies for session management and analytics.

5. Third Parties
We may share necessary booking details with the Purohit you book. No other third-party sharing occurs without your consent.

6. Your Rights
You may request deletion of your account and data by contacting us at support@poojasetu.com.`,

  cancellation: `Cancellation & Refund Policy

1. Full Refund (100%)
Cancellations made more than 24 hours before the scheduled Muhurtham time are eligible for a full refund.

2. Partial Refund (50%)
Cancellations made between 12 to 24 hours before the scheduled time are eligible for a 50% refund.

3. No Refund
Cancellations made less than 12 hours before the scheduled Muhurtham are not eligible for any refund.

4. Purohit No-Show
In the event that a confirmed Purohit does not show up, a 100% refund will be issued within 3-5 business days.

5. Rescheduling
One free reschedule is allowed up to 24 hours before the booking. Subsequent reschedules may incur a ₹99 fee.

6. Refund Timeline
Approved refunds are processed within 5-7 business days to the original payment method.

Contact: support@poojasetu.com`
};

exports.getContent = async (req, res) => {
  const { type } = req.params;

  if (!['terms', 'privacy', 'cancellation'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid content type' });
  }

  try {
    // Try to fetch from app_config table if it exists
    const result = await db.query(
      `SELECT value FROM ps.app_config WHERE key = $1 LIMIT 1`,
      [`content_${type}`]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, content: result.rows[0].value });
    }

    // Fallback to hardcoded content
    return res.json({ success: true, content: fallbackContent[type] });
  } catch (err) {
    // Table may not exist — return fallback content gracefully
    return res.json({ success: true, content: fallbackContent[type] });
  }
};
