const pool = require('../config/db');

const bookingError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const venueTypes = new Map([
  ['home', 'home'],
  ['temple', 'temple'],
  ['function hall', 'function_hall'],
  ['function_hall', 'function_hall'],
  ['office', 'office'],
  ['other', 'other']
]);

exports.createBooking = async (req, res) => {
  let client;
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw bookingError(401, 'Please sign in again before booking.');
    }

    const {
      pooja_id,
      sampradayam,
      purohit_id,
      starts_at,
      ends_at,
      venue_type,
      addressFlat,
      addressArea,
      pincode: requestedPincode,
      guests,
      mode,
      dakshina_amount,
      samagri_amount,
      food_amount,
      addon_amount,
      platform_fee,
      tax_amount,
      discount_amount,
      total_payable,
      diet_preference,
      booked_for_name,
      booked_for_phone
    } = req.body;

    const startDate = new Date(starts_at);
    const endDate = new Date(ends_at);
    if (!starts_at || !ends_at || !Number.isFinite(startDate.getTime()) ||
        !Number.isFinite(endDate.getTime()) || endDate <= startDate) {
      throw bookingError(400, 'Select a valid future booking date and time before paying.');
    }
    if (!pooja_id || !sampradayam) {
      throw bookingError(400, 'Pooja and sampradayam are required to create a booking.');
    }

    const normalizedVenue = venueTypes.get(String(venue_type || 'home').toLowerCase());
    if (!normalizedVenue) {
      throw bookingError(400, 'Select a valid booking venue.');
    }
    const bookingMode = mode === 'purohit' || mode === 'purohit_only'
      ? 'purohit_only'
      : mode === 'complete' || mode === 'package'
        ? 'package'
        : null;
    if (!bookingMode) {
      throw bookingError(400, 'Select a valid booking package.');
    }

    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SET search_path TO ps, public');

    const userResult = await client.query(
      `SELECT id FROM app_user WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      throw bookingError(401, 'Your account could not be found. Please sign in again.');
    }

    const addressResult = await client.query(
      `SELECT id, pincode
       FROM address
       WHERE user_id = $1
       ORDER BY is_default DESC
       LIMIT 1`,
      [userId]
    );
    const savedAddress = addressResult.rows[0];
    const pincode = requestedPincode || savedAddress?.pincode;
    if (!pincode) {
      throw bookingError(400, 'Add a service address and pincode to your profile before booking.');
    }

    const zoneResult = await client.query(
      `SELECT zone_id
       FROM pincode
       WHERE code = $1 AND serviceable = true AND zone_id IS NOT NULL`,
      [pincode]
    );
    if (zoneResult.rows.length === 0) {
      throw bookingError(400, 'The selected pincode is not currently serviceable.');
    }

    let addressId = savedAddress?.id;
    if (!addressId || addressFlat || addressArea || (savedAddress && pincode !== savedAddress.pincode)) {
      const streetAddress = [addressFlat, addressArea].filter(Boolean).join(', ') || null;
      const bookingAddress = await client.query(
        `INSERT INTO address (id, user_id, label, line1, pincode, is_default)
         VALUES (gen_random_uuid(), $1, 'Booking', $2, $3, false)
         RETURNING id`,
        [userId, streetAddress, pincode]
      );
      addressId = bookingAddress.rows[0].id;
    }

    let vidhiResult = await client.query(
      `SELECT pv.id AS pooja_vidhi_id, pv.current_version_id, s.id AS sampradayam_id
       FROM pooja_vidhi pv
       JOIN sampradayam s ON pv.sampradayam_id = s.id
       WHERE pv.pooja_id = $1 AND s.name->>'en' = $2`,
      [pooja_id, sampradayam || 'Smartha']
    );
    if (vidhiResult.rows.length === 0) {
      vidhiResult = await client.query(
        `SELECT pv.id AS pooja_vidhi_id, pv.current_version_id, s.id AS sampradayam_id
         FROM pooja_vidhi pv
         JOIN sampradayam s ON pv.sampradayam_id = s.id
         WHERE pv.pooja_id = $1
         LIMIT 1`,
        [pooja_id]
      );
    }
    if (vidhiResult.rows.length === 0) {
      throw bookingError(400, 'This pooja is not available for the selected sampradayam.');
    }
    const { pooja_vidhi_id, current_version_id, sampradayam_id } = vidhiResult.rows[0];
    if (!current_version_id) {
      throw bookingError(400, 'The selected pooja is not currently available for booking.');
    }

    const bookingResult = await client.query(
      `INSERT INTO booking (
         booking_no, user_id, pooja_vidhi_id, vidhi_version_id, sampradayam_id,
         starts_at, ends_at, venue_type, address_id, zone_id, guests, mode, status,
         dakshina_amount, samagri_amount, food_amount, addon_amount, platform_fee,
         tax_amount, discount_amount, total_payable, diet_preference,
         booked_for_name, booked_for_phone
       ) VALUES (
         'BK-' || extract(epoch from now())::int, $1, $2, $3, $4,
         $5, $6, $7, $8, $9, $10, $11, 'draft',
         $12, $13, $14, $15, $16, $17, $18, $19, $20,
         $21, $22
       ) RETURNING id, booking_no`,
      [
        userId, pooja_vidhi_id, current_version_id, sampradayam_id,
        startDate.toISOString(), endDate.toISOString(), normalizedVenue, addressId,
        zoneResult.rows[0].zone_id, guests, bookingMode,
        dakshina_amount, samagri_amount, food_amount, addon_amount, platform_fee,
        tax_amount, discount_amount, total_payable, diet_preference || 'satvik',
        booked_for_name || null, booked_for_phone || null
      ]
    );

    const bookingId = bookingResult.rows[0].id;
    if (purohit_id) {
      await client.query(
        `INSERT INTO booking_assignment (booking_id, purohit_id, status)
         VALUES ($1, $2, 'offered')`,
        [bookingId, purohit_id]
      );
    }

    await client.query('COMMIT');
    return res.json({
      success: true,
      message: 'Booking created successfully',
      data: bookingResult.rows[0]
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Booking could not be saved. Please try again.' });
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getMyBookings = async (req, res) => {
  const { mobileNumber } = req.query;
  if (!mobileNumber) return res.status(400).json({ success: false, message: 'mobileNumber required' });
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');
    const query = "SELECT b.*, pv.pooja_id, p.name->>'en' as pooja_name, a.line1 as address, pur.name as purohit_name, s.name->>'en' as status_name FROM booking b JOIN app_user u ON b.user_id = u.id JOIN pooja_vidhi pv ON b.pooja_vidhi_id = pv.id JOIN pooja p ON pv.pooja_id = p.id LEFT JOIN address a ON b.address_id = a.id LEFT JOIN booking_assignment ba ON b.id = ba.booking_id LEFT JOIN purohit pur ON ba.purohit_id = pur.id LEFT JOIN booking_status_history bsh ON b.id = bsh.booking_id JOIN booking_status_history s ON b.id = s.booking_id WHERE u.phone_e164 = $1";
    const result = await client.query(query, [mobileNumber]);
    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};
