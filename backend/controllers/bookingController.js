const pool = require('../config/db');

exports.createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET search_path TO ps, public');

    const {
      pooja_id,
      sampradayam,
      purohit_id,
      starts_at,
      ends_at,
      venue_type,
      guests,
      mode, // 'purohit_only' or 'package'
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

    // Hardcode user and address for now since auth is mocked
    // In a real scenario, req.user.id would be used
    const userResult = await client.query(`SELECT id FROM "user" LIMIT 1`);
    if (userResult.rows.length === 0) throw new Error("No users found");
    const userId = userResult.rows[0].id;

    const addressResult = await client.query(`SELECT id, pincode FROM "address" WHERE user_id = $1 LIMIT 1`, [userId]);
    if (addressResult.rows.length === 0) throw new Error("User has no address");
    const addressId = addressResult.rows[0].id;
    const pincode = addressResult.rows[0].pincode;

    const zoneResult = await client.query(`SELECT zone_id FROM pincode_zone WHERE pincode = $1 LIMIT 1`, [pincode]);
    if (zoneResult.rows.length === 0) throw new Error("No zone found for pincode");
    const zoneId = zoneResult.rows[0].zone_id;

    // Resolve pooja_vidhi_id, vidhi_version_id, sampradayam_id
    const vidhiResult = await client.query(`
      SELECT pv.id as pooja_vidhi_id, pv.current_version_id, s.id as sampradayam_id
      FROM pooja_vidhi pv
      JOIN sampradayam s ON pv.sampradayam_id = s.id
      WHERE pv.pooja_id = $1 AND s.name->>'en' = $2
    `, [pooja_id, sampradayam]);
    
    if (vidhiResult.rows.length === 0) throw new Error("Pooja vidhi not found");
    const { pooja_vidhi_id, current_version_id, sampradayam_id } = vidhiResult.rows[0];

    // Create the booking
    const insertBooking = `
      INSERT INTO booking (
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
      ) RETURNING id, booking_no
    `;

    const bookingResult = await client.query(insertBooking, [
      userId, pooja_vidhi_id, current_version_id, sampradayam_id,
      starts_at, ends_at, venue_type, addressId, zoneId, guests, mode,
      dakshina_amount, samagri_amount, food_amount, addon_amount, platform_fee,
      tax_amount, discount_amount, total_payable, diet_preference || 'none',
      booked_for_name || null, booked_for_phone || null
    ]);

    const bookingId = bookingResult.rows[0].id;

    // Optionally assign purohit if purohit_id was provided
    if (purohit_id) {
        await client.query(`
            INSERT INTO booking_assignment (booking_id, purohit_id, status)
            VALUES ($1, $2, 'requested')
        `, [bookingId, purohit_id]);
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Booking created successfully', data: bookingResult.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  } finally {
    client.release();
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
