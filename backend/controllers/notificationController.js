const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        // We will fetch notifications for the user
        // For now, if no userId is provided, we fetch all notifications. 
        // In a real app, this should be filtered by req.user.id from the auth token
        const userId = req.query.userId || req.headers['user-id'];

        let query = `
            SELECT 
                n.id, 
                n.channel, 
                n.status, 
                n.created_at,
                t.code as template_code,
                t.body as template_body
            FROM ps.notification_log n
            LEFT JOIN ps.notification_template t ON n.template_id = t.id
        `;
        
        let params = [];
        if (userId) {
            query += ` WHERE n.recipient_id = $1 ORDER BY n.created_at DESC`;
            params.push(userId);
        } else {
            query += ` ORDER BY n.created_at DESC LIMIT 50`;
        }

        const result = await db.query(query, params);

        // Map database records to frontend notification structure
        const notifications = result.rows.map(row => {
            // Determine type and category based on template_code
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

            // In a complete implementation, template variables (e.g. {{pooja}}) would be replaced 
            // by variables stored in notification_log or fetched dynamically.
            const message = row.template_body || 'You have a new notification.';

            return {
                id: row.id.toString(),
                type: type,
                title: title,
                message: message,
                time: new Date(row.created_at).toLocaleString(), // Simple formatting
                isRead: row.status === 'read',
                category: category,
                // navigateTo can be added dynamically based on type
            };
        });

        // Group by 'Today' / 'Earlier' for the UI (simplistic grouping)
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
