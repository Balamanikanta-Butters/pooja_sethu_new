const db = require('../config/db');

exports.getAllPoojas = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                p.id,
                p.name->>'en' AS title,
                p.name->>'te' AS subtitle,
                p.significance->>'en' AS "desc",
                c.name->>'en' AS category,
                (SELECT MIN(vv.dakshina_min) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as min_price,
                (SELECT MAX(vv.dakshina_max) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as max_price,
                (SELECT MAX(vv.duration_minutes) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as duration
            FROM ps.pooja p
            LEFT JOIN ps.pooja_category c ON p.category_id = c.id
            WHERE p.status = 'active'
            ORDER BY c.sort_order ASC, p.name->>'en' ASC
        `);

        // Format data to match frontend expectations
        const formattedData = result.rows.map(row => {
            let durationText = '';
            if (row.duration) {
                const hrs = Math.floor(row.duration / 60);
                const mins = row.duration % 60;
                durationText = hrs > 0 ? (mins > 0 ? `${hrs}.${mins/6} hrs` : `${hrs} hrs`) : `${mins} min`;
            } else {
                durationText = '2 hrs'; // fallback
            }

            let priceText = '';
            if (row.min_price && row.max_price) {
                priceText = `₹${Number(row.min_price).toLocaleString('en-IN')} – ₹${Number(row.max_price).toLocaleString('en-IN')}`;
            } else {
                priceText = 'Price on Request';
            }

            return {
                id: row.id,
                title: row.title,
                subtitle: row.subtitle,
                desc: row.desc,
                category: row.category,
                price: priceText,
                duration: durationText,
                sampradayam: 'All Sampradayams', // Assuming it's available for all unless joined
            };
        });

        res.status(200).json({ success: true, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching poojas' });
    }
};

exports.getPurohits = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                p.id,
                p.name,
                p.title,
                p.bio->>'en' as bio,
                p.photo_url,
                p.gurukulam,
                p.verification,
                p.experience_years,
                (SELECT ROUND(AVG(rating), 1) FROM ps.review WHERE purohit_id = p.id AND moderation = 'approved') as rating,
                (SELECT COUNT(*) FROM ps.review WHERE purohit_id = p.id AND moderation = 'approved') as reviews,
                v.name->>'en' as veda,
                (SELECT MIN(dakshina) FROM ps.purohit_vidhi WHERE purohit_id = p.id) as min_dakshina,
                (SELECT string_agg(s.name->>'en', ', ') FROM ps.purohit_sampradayam psamp JOIN ps.sampradayam s ON psamp.sampradayam_id = s.id WHERE psamp.purohit_id = p.id) as sampradayam_list,
                (SELECT string_agg(l.name, ', ') FROM ps.purohit_language pl JOIN ps.language l ON pl.language_code = l.code WHERE pl.purohit_id = p.id) as language_list
            FROM ps.purohit p
            LEFT JOIN ps.veda_shakha v ON p.veda_shakha_id = v.id
        `);

        const formattedData = result.rows.map(row => {
            const initials = row.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return {
                id: row.id,
                initials: initials,
                name: row.title ? `${row.title}. ${row.name}` : row.name,
                photo_url: row.photo_url,
                bio: row.bio,
                gurukulam: row.gurukulam,
                experience: row.experience_years,
                verified: row.verification === 'verified',
                sampradayam: row.sampradayam_list || 'Samanya',
                languages: row.language_list ? row.language_list.split(', ') : [],
                desc: `${row.veda || 'Veda'} · ${row.experience_years} yrs`,
                rating: row.rating ? Number(row.rating).toFixed(1) : 'New',
                reviews: Number(row.reviews) || 0,
                distance: 'N/A', // Distance requires geo-query
                dakshina: row.min_dakshina ? `₹${Number(row.min_dakshina).toLocaleString('en-IN')}` : 'Price on request',
                raw_dakshina: row.min_dakshina ? Number(row.min_dakshina) : 999999
            };
        });

        res.status(200).json({ success: true, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching purohits' });
    }
};

exports.getAddons = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, code, name->>'en' as name, default_price 
            FROM ps.addon_type 
            WHERE status = 'active'
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching addons' });
    }
};

exports.getPoojaDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { sampradayam } = req.query; // 'Smartha', etc.
        
        let sampradayamFilter = 'Smartha';
        if (sampradayam && sampradayam !== 'Not sure') {
            sampradayamFilter = sampradayam;
        }

        // Fetch vidhi steps
        const stepsRes = await db.query(`
            SELECT vs.name->>'en' as step_name
            FROM ps.pooja_vidhi pv
            JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
            JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
            JOIN ps.vidhi_step vs ON vv.id = vs.vidhi_version_id
            WHERE pv.pooja_id = $1 AND s.name->>'en' = $2
            ORDER BY vs.step_no ASC
        `, [id, sampradayamFilter]);

        // Fetch samagri items (platform provided)
        const samagriRes = await db.query(`
            SELECT si.name->>'en' as item_name
            FROM ps.pooja_vidhi pv
            JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
            JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
            JOIN ps.vidhi_samagri vsa ON vv.id = vsa.vidhi_version_id
            JOIN ps.samagri_item si ON vsa.samagri_item_id = si.id
            WHERE pv.pooja_id = $1 AND s.name->>'en' = $2 AND vsa.supplied_by != 'family'
        `, [id, sampradayamFilter]);

        // Fetch family tasks & family supplied samagri
        const tasksRes = await db.query(`
            SELECT vft.task->>'en' as task_name
            FROM ps.pooja_vidhi pv
            JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
            JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
            JOIN ps.vidhi_family_task vft ON vv.id = vft.vidhi_version_id
            WHERE pv.pooja_id = $1 AND s.name->>'en' = $2
            ORDER BY vft.sort_order ASC
        `, [id, sampradayamFilter]);

        const familySamagriRes = await db.query(`
            SELECT si.name->>'en' as item_name
            FROM ps.pooja_vidhi pv
            JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
            JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
            JOIN ps.vidhi_samagri vsa ON vv.id = vsa.vidhi_version_id
            JOIN ps.samagri_item si ON vsa.samagri_item_id = si.id
            WHERE pv.pooja_id = $1 AND s.name->>'en' = $2 AND vsa.supplied_by = 'family'
        `, [id, sampradayamFilter]);

        // Combine family tasks and family samagri
        const familyArranges = [
            ...tasksRes.rows.map(r => r.task_name),
            ...familySamagriRes.rows.map(r => r.item_name)
        ];

        res.status(200).json({
            success: true,
            data: {
                vidhiSteps: stepsRes.rows.map(r => r.step_name),
                samagriItems: samagriRes.rows.map(r => r.item_name),
                familyArranges: familyArranges
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching pooja details' });
    }
};

exports.getPurohitReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT 
                r.id,
                r.rating,
                r.body,
                r.created_at,
                u.name as reviewer_name
            FROM ps.review r
            JOIN ps.app_user u ON r.user_id = u.id
            WHERE r.purohit_id = $1 AND r.moderation = 'approved'
            ORDER BY r.created_at DESC
        `, [id]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching purohit reviews' });
    }
};

exports.getPackageOptions = async (req, res) => {
    try {
        const catererRes = await db.query(`SELECT name->>'en' as name, price_per_plate, min_guests FROM ps.caterer_menu WHERE status = 'active'`);
        const addonsRes = await db.query(`SELECT code, name->>'en' as name, default_price FROM ps.addon_type WHERE status = 'active'`);
        const settingsRes = await db.query(`
            SELECT key, value 
            FROM ps.app_setting 
            WHERE key IN ('min_bhojanam_guests', 'coordination_fee_inr', 'gst_on_fees_pct')
        `);

        let settings = {};
        settingsRes.rows.forEach(r => {
            settings[r.key] = r.value;
        });

        res.status(200).json({
            success: true,
            data: {
                caterer: catererRes.rows,
                addons: addonsRes.rows,
                settings: settings
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching package options' });
    }
};
