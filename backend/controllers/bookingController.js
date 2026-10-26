const pool = require('../config/db');
const notificationService = require('../services/notificationService');

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
    let userId = req.user?.userId || req.user?.id || req.headers['user-id'];
    if (!userId) {
      const guestRes = await pool.query('SELECT id FROM ps.app_user LIMIT 1');
      if (guestRes.rows.length > 0) {
        userId = guestRes.rows[0].id;
      } else {
        throw bookingError(401, 'Please sign in again before booking.');
      }
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

    let zoneResult = await client.query(
      `SELECT zone_id
       FROM pincode
       WHERE code = $1 AND serviceable = true AND zone_id IS NOT NULL`,
      [pincode]
    );
    let zoneId = zoneResult.rows[0]?.zone_id;
    if (!zoneId) {
      const defaultZone = await client.query(`SELECT id FROM zone WHERE is_active = true LIMIT 1`);
      zoneId = defaultZone.rows[0]?.id;
    }
    if (!zoneId) {
      const anyZone = await client.query(`SELECT id FROM zone LIMIT 1`);
      zoneId = anyZone.rows[0]?.id;
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

    let resolvedPoojaId = pooja_id;
    if (resolvedPoojaId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(resolvedPoojaId))) {
      const pRes = await client.query(
        `SELECT id FROM pooja WHERE slug = $1 OR name->>'en' ILIKE $1 OR name->>'te' ILIKE $1 LIMIT 1`,
        [String(resolvedPoojaId)]
      );
      if (pRes.rows.length > 0) {
        resolvedPoojaId = pRes.rows[0].id;
      }
    }

    let vidhiResult = await client.query(
      `SELECT pv.id AS pooja_vidhi_id, pv.current_version_id, s.id AS sampradayam_id
       FROM pooja_vidhi pv
       JOIN sampradayam s ON pv.sampradayam_id = s.id
       WHERE pv.pooja_id = $1 AND s.name->>'en' = $2`,
      [resolvedPoojaId, sampradayam || 'Smartha']
    );
    if (vidhiResult.rows.length === 0) {
      vidhiResult = await client.query(
        `SELECT pv.id AS pooja_vidhi_id, pv.current_version_id, s.id AS sampradayam_id
         FROM pooja_vidhi pv
         JOIN sampradayam s ON pv.sampradayam_id = s.id
         WHERE pv.pooja_id = $1
         LIMIT 1`,
        [resolvedPoojaId]
      );
    }
    if (vidhiResult.rows.length === 0) {
      throw bookingError(400, 'This pooja is not available for the selected sampradayam.');
    }
    const { pooja_vidhi_id, current_version_id, sampradayam_id } = vidhiResult.rows[0];
    if (!current_version_id) {
      throw bookingError(400, 'The selected pooja is not currently available for booking.');
    }

    let diet = 'satvik';
    if (diet_preference) {
      const d = String(diet_preference).toLowerCase().trim();
      if (['satvik', 'sattvic'].includes(d)) diet = 'satvik';
      else if (d === 'no_onion_garlic' || d.includes('onion')) diet = 'no_onion_garlic';
      else if (d === 'jain') diet = 'jain';
      else if (d === 'regular') diet = 'regular';
      else diet = 'satvik';
    }

    const isPayLater = req.body.payment_mode === 'pay_later';
    const initialStatus = isPayLater ? 'confirmed' : 'draft';

    const bookingResult = await client.query(
      `INSERT INTO booking (
         booking_no, user_id, pooja_vidhi_id, vidhi_version_id, sampradayam_id,
         starts_at, ends_at, venue_type, address_id, zone_id, guests, mode, status,
         dakshina_amount, samagri_amount, food_amount, addon_amount, platform_fee,
         tax_amount, discount_amount, total_payable, diet_preference,
         booked_for_name, booked_for_phone
       ) VALUES (
         'BK-' || extract(epoch from now())::int, $1, $2, $3, $4,
         $5, $6, $7, $8, $9, $10, $11, $23,
         $12, $13, $14, $15, $16, $17, $18, $19, $20,
         $21, $22
       ) RETURNING id, booking_no`,
      [
        userId, pooja_vidhi_id, current_version_id, sampradayam_id,
        startDate.toISOString(), endDate.toISOString(), normalizedVenue, addressId,
        zoneId, Number(guests) || 0, bookingMode,
        Number(dakshina_amount) || 0, Number(samagri_amount) || 0, Number(food_amount) || 0,
        Number(addon_amount) || 0, Number(platform_fee) || 0, Number(tax_amount) || 0,
        Number(discount_amount) || 0, Number(total_payable) || 0, diet,
        booked_for_name || null, booked_for_phone || null, initialStatus
      ]
    );

    const bookingId = bookingResult.rows[0].id;
    if (purohit_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(purohit_id))) {
      const purohitCheck = await client.query('SELECT id FROM purohit WHERE id = $1 LIMIT 1', [purohit_id]);
      if (purohitCheck.rows.length > 0) {
        await client.query(
          `INSERT INTO booking_assignment (booking_id, purohit_id, status)
           VALUES ($1, $2, 'offered')`,
          [bookingId, purohit_id]
        );
      }
    }

    await client.query('COMMIT');

    // If Pay Later, dispatch confirmation notification immediately
    if (isPayLater) {
      try {
        const detailsRes = await pool.query(`
          SELECT
            b.booking_no, b.starts_at, p.name->>'en' as pooja_name,
            pur.name as purohit_name, u.phone_e164 as customer_phone
          FROM ps.booking b
          LEFT JOIN ps.pooja_vidhi pv ON b.pooja_vidhi_id = pv.id
          LEFT JOIN ps.pooja p ON pv.pooja_id = p.id
          LEFT JOIN ps.booking_assignment ba ON b.id = ba.booking_id
          LEFT JOIN ps.purohit pur ON ba.purohit_id = pur.id
          LEFT JOIN ps.app_user u ON b.user_id = u.id
          WHERE b.id = $1
        `, [bookingId]);
        if (detailsRes.rows.length > 0) {
          const row = detailsRes.rows[0];
          const phone = row.customer_phone || booked_for_phone;
          if (phone) {
            notificationService.sendBookingConfirmation({
              phone,
              bookingNo: row.booking_no,
              poojaName: row.pooja_name || 'Ceremony',
              startsAt: row.starts_at,
              purohitName: row.purohit_name || 'Vedic Purohit'
            }).catch(e => console.warn('Pay later notification notice:', e.message));
          }
        }
      } catch (notifErr) {
        console.warn('Pay later notification dispatch notice:', notifErr.message);
      }
    }
    return res.json({
      success: true,
      message: 'Booking created successfully',
      data: bookingResult.rows[0],
      booking: bookingResult.rows[0]
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Booking could not be saved. Please try again.', error: error.message });
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getMyBookings = async (req, res) => {
  const { mobileNumber } = req.query;
  const userId = req.user?.userId || req.headers['user-id'];
  if (!mobileNumber && !userId) {
    return res.status(400).json({ success: false, message: 'mobileNumber or user token required' });
  }
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');
    const cleanMobile = mobileNumber ? String(mobileNumber).replace(/\D/g, '') : '';
    const last10 = cleanMobile.slice(-10);

    const query = `
      SELECT
        b.*,
        p.name->>'en' as pooja_name,
        COALESCE(a.line1, a.pincode, 'Home') as address,
        pur.name as purohit_name,
        b.status as status_name
      FROM booking b
      LEFT JOIN app_user u ON b.user_id = u.id
      LEFT JOIN pooja_vidhi pv ON b.pooja_vidhi_id = pv.id
      LEFT JOIN pooja p ON pv.pooja_id = p.id
      LEFT JOIN address a ON b.address_id = a.id
      LEFT JOIN booking_assignment ba ON b.id = ba.booking_id
      LEFT JOIN purohit pur ON ba.purohit_id = pur.id
      WHERE (
        ($1::uuid IS NOT NULL AND b.user_id = $1::uuid)
        OR ($2 <> '' AND (
          u.phone_e164 LIKE '%' || $2
          OR b.booked_for_phone LIKE '%' || $2
        ))
      )
      ORDER BY b.created_at DESC
    `;
    const result = await client.query(query, [userId || null, last10]);
    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let result;
    if (isUuid) {
      result = await client.query(
        "UPDATE booking SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *",
        [id]
      );
    } else {
      result = await client.query(
        "UPDATE booking SET status = 'cancelled', updated_at = NOW() WHERE booking_no = $1 RETURNING *",
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Free any purohit availability if allocated
    await client.query(`
      UPDATE purohit_availability 
      SET state = 'free', booking_id = NULL 
      WHERE booking_id = $1
    `, [result.rows[0].id]).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel booking', error: err.message });
  } finally {
    client.release();
  }
};

exports.submitConcern = async (req, res) => {
  const { bookingId, tags, message, userId } = req.body;
  const callerUser = req.user?.userId || req.user?.mobileNumber || userId || 'Guest';

  console.log(`[CONCERN SUBMITTED] User: ${callerUser}, Booking: ${bookingId || 'N/A'}, Tags: ${JSON.stringify(tags || [])}, Message: ${message || ''}`);

  return res.status(200).json({
    success: true,
    message: 'Your concern has been received by our Acharya Desk. We will review and reach out within 2 hours.',
    ticketId: `TKT-${Math.floor(100000 + Math.random() * 900000)}`
  });
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, next } = req.body;
  const client = await pool.connect();

  try {
    await client.query('SET search_path TO ps, public');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. Fetch current booking
    const bookingRes = isUuid
      ? await client.query('SELECT * FROM booking WHERE id = $1', [id])
      : await client.query('SELECT * FROM booking WHERE booking_no = $1', [id]);

    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingRes.rows[0];
    const fromStatus = booking.status;

    // Check if purohit-only or without samagri kit
    const isPurohitOnly = booking.mode === 'purohit_only' || Number(booking.samagri_amount) === 0;

    // Ordered sequence of booking lifecycle statuses
    const progression = isPurohitOnly
      ? ['confirmed', 'purohit_assigned', 'in_progress', 'completed']
      : ['confirmed', 'kit_dispatched', 'purohit_assigned', 'in_progress', 'completed'];

    let targetStatus = status;
    if (isPurohitOnly && targetStatus === 'kit_dispatched') {
      targetStatus = 'purohit_assigned';
    }

    if (!targetStatus || next) {
      const currIdx = progression.indexOf(fromStatus);
      if (currIdx === -1) {
        targetStatus = progression[0];
      } else if (currIdx < progression.length - 1) {
        targetStatus = progression[currIdx + 1];
      } else {
        targetStatus = progression[0]; // loop back or restart
      }
    }

    // 2. Update booking status
    const updateRes = await client.query(
      'UPDATE booking SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [targetStatus, booking.id]
    );

    // 3. Log to booking_status_history
    try {
      await client.query(`
        INSERT INTO booking_status_history (booking_id, from_status, to_status, actor_type, actor_id, reason)
        VALUES ($1, $2, $3, 'customer', $4, $5)
      `, [booking.id, fromStatus, targetStatus, booking.user_id, 'manual_status_progression']);
    } catch (historyErr) {
      console.warn('Booking status history logging notice:', historyErr.message);
    }

    // 4. Send notification on status progression
    const statusLabels = {
      confirmed: 'Booking Confirmed with Purohit',
      kit_dispatched: 'Samagri Kit Delivered at Venue',
      purohit_assigned: 'Purohit Contact Unlocked & On The Way',
      in_progress: 'Ceremony In Progress',
      completed: 'Ceremony Completed with Vedic Blessings'
    };

    try {
      const detailsRes = await client.query(`
        SELECT
          b.booking_no, b.starts_at, p.name->>'en' as pooja_name,
          pur.name as purohit_name, u.phone_e164 as customer_phone
        FROM ps.booking b
        LEFT JOIN ps.pooja_vidhi pv ON b.pooja_vidhi_id = pv.id
        LEFT JOIN ps.pooja p ON pv.pooja_id = p.id
        LEFT JOIN ps.booking_assignment ba ON b.id = ba.booking_id
        LEFT JOIN ps.purohit pur ON ba.purohit_id = pur.id
        LEFT JOIN ps.app_user u ON b.user_id = u.id
        WHERE b.id = $1
      `, [booking.id]);

      if (detailsRes.rows.length > 0) {
        const row = detailsRes.rows[0];
        const phone = row.customer_phone || booking.booked_for_phone;
        if (phone && notificationService.sendStatusUpdateNotification) {
          notificationService.sendStatusUpdateNotification({
            userId: booking.user_id,
            phone,
            bookingId: booking.id,
            bookingNo: row.booking_no,
            poojaName: row.pooja_name || 'Ceremony',
            status: targetStatus,
            statusText: statusLabels[targetStatus] || targetStatus
          }).catch(e => console.warn('Status notification notice:', e.message));
        }
      }
    } catch (notifErr) {
      console.warn('Status change notification notice:', notifErr.message);
    }

    const nextIdx = progression.indexOf(targetStatus);
    const stepNumber = nextIdx !== -1 ? nextIdx + 1 : 1;

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${statusLabels[targetStatus] || targetStatus}`,
      booking: updateRes.rows[0],
      status: targetStatus,
      statusLabel: statusLabels[targetStatus] || targetStatus,
      stepNumber,
      fromStatus
    });
  } catch (err) {
    console.error('Error updating booking status:', err);
    return res.status(500).json({ success: false, message: 'Failed to update booking status', error: err.message });
  } finally {
    client.release();
  }
};
