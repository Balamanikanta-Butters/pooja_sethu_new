const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const rawUserId = req.query.userId || req.query.mobileNumber || req.headers['user-id'] || req.user?.userId;

        let resolvedUserId = null;
        if (rawUserId) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(rawUserId).trim());
            if (isUuid) {
                resolvedUserId = String(rawUserId).trim();
            } else {
                const cleanPhone = String(rawUserId).replace(/\D/g, '').slice(-10);
                if (cleanPhone) {
                    const userRes = await db.query(
                        `SELECT id FROM ps.app_user WHERE phone_e164 LIKE '%' || $1 LIMIT 1`,
                        [cleanPhone]
                    );
                    if (userRes.rows.length > 0) {
                        resolvedUserId = userRes.rows[0].id;
                    }
                }
            }
        }

        let query = `
            SELECT 
                n.id, 
                n.channel, 
                n.status, 
                n.created_at,
                n.booking_id,
                t.code as template_code,
                t.body as template_body,
                b.booking_no,
                b.starts_at,
                p.name->>'en' as pooja_name,
                pur.name as purohit_name
            FROM ps.notification_log n
            LEFT JOIN ps.notification_template t ON n.template_id = t.id
            LEFT JOIN ps.booking b ON n.booking_id = b.id
            LEFT JOIN ps.pooja_vidhi pv ON b.pooja_vidhi_id = pv.id
            LEFT JOIN ps.pooja p ON pv.pooja_id = p.id
            LEFT JOIN ps.booking_assignment ba ON b.id = ba.booking_id
            LEFT JOIN ps.purohit pur ON ba.purohit_id = pur.id
        `;
        
        let params = [];
        if (resolvedUserId) {
            query += ` WHERE n.recipient_id = $1 ORDER BY n.created_at DESC`;
            params.push(resolvedUserId);
        } else {
            query += ` ORDER BY n.created_at DESC LIMIT 50`;
        }

        const result = await db.query(query, params);

        // Map database records to frontend notification structure
        const notifications = result.rows.map(row => {
            let type = 'update';
            let category = 'bookings';
            let title = 'Notification';
            
            if (row.template_code === 'booking_confirmed') {
                type = 'booking';
                title = 'Booking Confirmed';
            } else if (row.template_code === 'payment_successful') {
                type = 'payment';
                category = 'payments';
                title = 'Payment Successful';
            } else if (row.template_code === 'pooja_reminder') {
                type = 'reminder';
                title = 'Pooja Reminder';
            } else if (row.template_code === 'purohit_on_the_way') {
                type = 'update';
                title = 'Purohit On The Way';
            } else if (row.template_code === 'samagri_delivery') {
                type = 'update';
                title = 'Samagri Delivery';
            }

            let message = row.template_body || 'You have a new notification.';
            if (row.pooja_name) message = message.replace(/\{\{pooja\}\}/g, row.pooja_name);
            if (row.purohit_name) message = message.replace(/\{\{purohit\}\}/g, row.purohit_name);
            if (row.booking_no) message = message.replace(/\{\{booking_no\}\}/g, row.booking_no);
            if (row.starts_at) {
                const dateStr = new Date(row.starts_at).toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short'
                });
                message = message.replace(/\{\{date\}\}/g, dateStr);
            }
            message = message.replace(/\{\{[^}]+\}\}/g, '').trim();

            return {
                id: row.id.toString(),
                type: type,
                title: title,
                message: message,
                time: new Date(row.created_at).toLocaleString(),
                isRead: row.status === 'read',
                category: category,
            };
        });

        const grouped = [
            {
                title: 'Recent',
                data: notifications
            }
        ];

        return res.status(200).json({
            success: true,
            data: grouped.length > 0 && grouped[0].data.length > 0 ? grouped : []
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Server error fetching notifications' });
    }
};
