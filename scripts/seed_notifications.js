const db = require('./config/db');

async function seedNotifications() {
    try {
        // Get the first user or create one
        let userRes = await db.query('SELECT id FROM ps.app_user LIMIT 1');
        let userId;
        
        if (userRes.rows.length > 0) {
            userId = userRes.rows[0].id;
        } else {
            console.log("No users found. Creating a test user...");
            let ins = await db.query(`INSERT INTO ps.app_user (phone_e164, created_at, updated_at) VALUES ('+919876543210', NOW(), NOW()) RETURNING id`);
            userId = ins.rows[0].id;
        }

        console.log(`Seeding notifications for user ${userId}...`);

        // Get some templates
        const templatesRes = await db.query("SELECT id, code FROM ps.notification_template LIMIT 3");
        
        if (templatesRes.rows.length > 0) {
            for (let i = 0; i < templatesRes.rows.length; i++) {
                const template = templatesRes.rows[i];
                await db.query(`
                    INSERT INTO ps.notification_log (template_id, recipient_type, recipient_id, channel, status)
                    VALUES ($1, 'customer', $2, 'whatsapp', 'sent')
                `, [template.id, userId]);
            }
            console.log("Successfully inserted mock notifications.");
        } else {
            console.log("No templates found to seed with.");
        }
    } catch (err) {
        console.error("Error seeding notifications:", err);
    } finally {
        process.exit(0);
    }
}

seedNotifications();
