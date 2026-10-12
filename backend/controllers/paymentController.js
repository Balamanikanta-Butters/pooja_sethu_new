const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

const configurationError = (message) => {
    const error = new Error(message);
    error.code = 'PAYMENT_CONFIGURATION';
    return error;
};

const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw configurationError('Razorpay test credentials are not configured');
    }
    if (!keyId.startsWith('rzp_test_')) {
        throw configurationError('Payment service is restricted to Razorpay test credentials');
    }

    return {
        keyId,
        client: new Razorpay({ key_id: keyId, key_secret: keySecret })
    };
};

exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        const bookingResult = await db.query(
            `SELECT id, total_payable, status, payment_status, razorpay_order_id
             FROM ps.booking
             WHERE id = $1`,
            [bookingId]
        );
        const booking = bookingResult.rows[0];
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.status !== 'draft' || booking.payment_status !== 'pending') {
            return res.status(409).json({ success: false, message: 'Booking is not awaiting payment' });
        }

        const amountInPaise = Math.round(Number(booking.total_payable) * 100);
        if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
            return res.status(400).json({ success: false, message: 'Booking amount is invalid' });
        }

        const { keyId, client } = getRazorpayClient();
        let orderId = booking.razorpay_order_id;
        if (!orderId) {
            const order = await client.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt: String(booking.id).slice(0, 40)
            });
            orderId = order.id;

            const updateResult = await db.query(
                `UPDATE ps.booking
                 SET razorpay_order_id = $1
                 WHERE id = $2 AND payment_status = 'pending' AND status = 'draft'`,
                [orderId, booking.id]
            );
            if (updateResult.rowCount !== 1) {
                return res.status(409).json({ success: false, message: 'Booking payment state changed; retry payment' });
            }
        }

        return res.status(200).json({
            success: true,
            order_id: orderId,
            amount: amountInPaise,
            currency: 'INR',
            key_id: keyId
        });
    } catch (err) {
        console.error('Error creating Razorpay order:', err.message);
        return res.status(err.code === 'PAYMENT_CONFIGURATION' ? 503 : 500).json({
            success: false,
            message: err.code === 'PAYMENT_CONFIGURATION'
                ? err.message
                : 'Failed to create payment order'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment details are missing' });
        }

        const bookingResult = await db.query(
            `SELECT id, user_id, status, payment_status, razorpay_order_id, razorpay_payment_id
             FROM ps.booking
             WHERE id = $1`,
            [bookingId]
        );
        const booking = bookingResult.rows[0];
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.razorpay_order_id !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: 'Payment order does not match booking' });
        }
        if (booking.payment_status === 'paid') {
            if (booking.razorpay_payment_id === razorpay_payment_id) {
                return res.status(200).json({ success: true, message: 'Payment already verified' });
            }
            return res.status(409).json({ success: false, message: 'Booking has already been paid' });
        }
        if (booking.payment_status !== 'pending' || booking.status !== 'draft') {
            return res.status(409).json({ success: false, message: 'Booking is not awaiting payment' });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') || !keySecret) {
            throw configurationError('Razorpay test credentials are not configured');
        }
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (!/^[a-f0-9]{64}$/i.test(razorpay_signature) ||
            !crypto.timingSafeEqual(
                Buffer.from(expectedSignature, 'hex'),
                Buffer.from(razorpay_signature, 'hex')
            )) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        const updateResult = await db.query(
            `UPDATE ps.booking
             SET payment_status = 'paid',
                 razorpay_payment_id = $1,
                 status = 'confirmed',
                 updated_at = NOW()
             WHERE id = $2
               AND razorpay_order_id = $3
               AND payment_status = 'pending'
               AND status = 'draft'`,
            [razorpay_payment_id, bookingId, razorpay_order_id]
        );
        if (updateResult.rowCount !== 1) {
            return res.status(409).json({ success: false, message: 'Booking payment state changed; please retry' });
        }

        // Insert notification and status history
        try {
            await db.query(`
                INSERT INTO ps.notification_log (template_id, recipient_type, recipient_id, booking_id, channel, status)
                VALUES ($1, 'customer', $2, $3, 'push', 'unread')
            `, ['30f5c363-9f91-47ea-95b0-8ea020fc9caf', booking.user_id, bookingId]);

            await db.query(`
                INSERT INTO ps.booking_status_history (booking_id, from_status, to_status, actor_type, actor_id, reason)
                VALUES ($1, 'draft', 'confirmed', 'customer', $2, 'payment_verified')
            `, [bookingId, booking.user_id]);
        } catch (notifErr) {
            console.error('Warning: Failed to log booking confirmation notification or status history:', notifErr.message);
        }

        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        console.error('Error verifying Razorpay payment:', err.message);
        return res.status(err.code === 'PAYMENT_CONFIGURATION' ? 503 : 500).json({
            success: false,
            message: err.code === 'PAYMENT_CONFIGURATION'
                ? err.message
                : 'Failed to verify payment'
        });
    }
};
