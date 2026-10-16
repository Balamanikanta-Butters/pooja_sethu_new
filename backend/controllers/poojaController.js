const db = require('../config/db');

exports.getServiceablePincodes = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.code, z.name AS area
            FROM ps.pincode p
            LEFT JOIN ps.zone z ON z.id = p.zone_id
            WHERE p.serviceable = true
            ORDER BY p.code
        `);
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching serviceable pincodes:', err);
        return res.status(500).json({ success: false, message: 'Failed to load serviceable pincodes' });
    }
};

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
                (SELECT MAX(vv.duration_minutes) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as duration,
                (SELECT string_agg(DISTINCT s.code, ',') FROM ps.pooja_vidhi pv JOIN ps.sampradayam s ON pv.sampradayam_id = s.id WHERE pv.pooja_id = p.id) as sampradayam_codes,
                (SELECT string_agg(DISTINCT s.name->>'en', ', ') FROM ps.pooja_vidhi pv JOIN ps.sampradayam s ON pv.sampradayam_id = s.id WHERE pv.pooja_id = p.id) as sampradayam_names
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
                sampradayam: row.sampradayam_names || 'All Sampradayams',
                sampradayam_codes: row.sampradayam_codes ? row.sampradayam_codes.split(',') : ['all'],
            };
        });

        res.status(200).json({ success: true, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching poojas' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                id,
                code,
                name->>'en' as name,
                name->>'te' as name_te,
                icon,
                svg_content,
                sort_order
            FROM ps.pooja_category
            WHERE status = 'active'
            ORDER BY sort_order ASC
        `);
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ success: false, message: 'Failed to load categories' });
    }
};

exports.getPurohits = async (req, res) => {
    try {
        const { date, muhurtham } = req.query;
        let targetDate = null;
        if (date && date.trim() && date !== 'undefined' && date !== 'null') {
            targetDate = date.trim();
        } else if (muhurtham === '11') {
            targetDate = '2026-10-11';
        } else if (muhurtham === '22') {
            targetDate = '2026-10-22';
        } else if (muhurtham === '25') {
            targetDate = '2026-10-25';
        }

        const queryText = `
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
                (SELECT string_agg(l.name, ', ') FROM ps.purohit_language pl JOIN ps.language l ON pl.language_code = l.code WHERE pl.purohit_id = p.id) as language_list,
                ${targetDate ? `
                (SELECT COUNT(*) FROM ps.purohit_availability WHERE purohit_id = p.id AND state = 'booked' AND DATE(starts_at AT TIME ZONE 'Asia/Kolkata') = $1::date) as booked_count,
                (SELECT COUNT(*) FROM ps.purohit_availability WHERE purohit_id = p.id AND state = 'free' AND DATE(starts_at AT TIME ZONE 'Asia/Kolkata') = $1::date) as free_count,
                ` : `
                (SELECT COUNT(*) FROM ps.purohit_availability WHERE purohit_id = p.id AND state = 'booked') as booked_count,
                (SELECT COUNT(*) FROM ps.purohit_availability WHERE purohit_id = p.id AND state = 'free') as free_count,
                `}
                (SELECT COUNT(*) FROM ps.purohit_availability WHERE purohit_id = p.id) as total_slots
            FROM ps.purohit p
            LEFT JOIN ps.veda_shakha v ON p.veda_shakha_id = v.id
        `;

        const queryParams = targetDate ? [targetDate] : [];
        const result = await db.query(queryText, queryParams);

        const formattedData = result.rows.map(row => {
            const initials = row.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            // Availability calculation
            let isAvailable = true;
            let availabilityStatus = 'available';

            if (Number(row.booked_count) > 0) {
                isAvailable = false;
                availabilityStatus = 'booked';
            } else if (Number(row.total_slots) === 0) {
                isAvailable = false;
                availabilityStatus = 'unavailable';
            } else if (targetDate && Number(row.free_count) === 0) {
                isAvailable = false;
                availabilityStatus = 'unavailable';
            }

            return {
                id: row.id,
                initials: initials,
                name: row.title ? `${row.title}. ${row.name}` : row.name,
                photo_url: row.photo_url,
                bio: row.bio,
                gurukulam: row.gurukulam,
                experience: row.experience_years,
                verified: row.verification === 'verified',
                is_available: isAvailable,
                availability_status: availabilityStatus,
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
        const { sampradayam } = req.query;

        // 1. Resolve Pooja record from ps.pooja
        const poojaRes = await db.query(`
            SELECT 
                p.id,
                p.code,
                p.name->>'en' as title,
                p.name->>'te' as subtitle,
                p.significance->>'en' as "desc",
                p.image_url,
                c.name->>'en' as category,
                (SELECT MIN(vv.dakshina_min) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as min_price,
                (SELECT MAX(vv.dakshina_max) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as max_price,
                (SELECT MAX(vv.duration_minutes) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as duration
            FROM ps.pooja p
            LEFT JOIN ps.pooja_category c ON p.category_id = c.id
            WHERE p.id::text = $1 
               OR p.code = $1 
               OR LOWER(p.name->>'en') = LOWER($1) 
               OR p.code ILIKE '%' || $1 || '%'
               OR LOWER(p.name->>'en') ILIKE '%' || $1 || '%'
            LIMIT 1
        `, [id]);

        if (poojaRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pooja not found in database' });
        }

        const pooja = poojaRes.rows[0];
        const resolvedPoojaId = pooja.id;

        // Format duration & price
        let durationText = '2 hrs';
        if (pooja.duration) {
            const hrs = Math.floor(pooja.duration / 60);
            const mins = pooja.duration % 60;
            durationText = hrs > 0 ? (mins > 0 ? `${hrs}.${mins / 6} hrs` : `${hrs} hrs`) : `${mins} min`;
        }

        let priceText = 'Price on Request';
        if (pooja.min_price && pooja.max_price) {
            priceText = `₹${Number(pooja.min_price).toLocaleString('en-IN')} – ₹${Number(pooja.max_price).toLocaleString('en-IN')}`;
        } else if (pooja.min_price) {
            priceText = `From ₹${Number(pooja.min_price).toLocaleString('en-IN')}`;
        }

        // Map frontend sampradayam codes to DB string names
        const sampradayamMap = {
            'smartha': 'Smartha',
            'madhva': 'Madhva',
            'srivaishnava': 'Sri Vaishnava',
            'vaikhanasa': 'Vaikhanasa',
            'pancharatra': 'Pancharatra',
            'samanya': 'Samanya (General)',
            'unknown': 'Not sure',
            'veerashaiva': 'Veerashaiva'
        };

        let mappedSampradayam = sampradayamMap[sampradayam?.toLowerCase()] || 'Smartha';
        if (mappedSampradayam === 'Not sure') mappedSampradayam = 'Smartha';

        const fetchDetailsForSampradayam = async (filter) => {
            const stepsRes = await db.query(`
                SELECT vs.name->>'en' as step_name
                FROM ps.pooja_vidhi pv
                JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
                JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
                JOIN ps.vidhi_step vs ON vv.id = vs.vidhi_version_id
                WHERE pv.pooja_id = $1 AND s.name->>'en' = $2
                ORDER BY vs.step_no ASC
            `, [resolvedPoojaId, filter]);

            const samagriRes = await db.query(`
                SELECT si.name->>'en' as item_name
                FROM ps.pooja_vidhi pv
                JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
                JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
                JOIN ps.vidhi_samagri vsa ON vv.id = vsa.vidhi_version_id
                JOIN ps.samagri_item si ON vsa.samagri_item_id = si.id
                WHERE pv.pooja_id = $1 AND s.name->>'en' = $2 AND vsa.supplied_by != 'family'
            `, [resolvedPoojaId, filter]);

            const tasksRes = await db.query(`
                SELECT vft.task->>'en' as task_name
                FROM ps.pooja_vidhi pv
                JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
                JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
                JOIN ps.vidhi_family_task vft ON vv.id = vft.vidhi_version_id
                WHERE pv.pooja_id = $1 AND s.name->>'en' = $2
                ORDER BY vft.sort_order ASC
            `, [resolvedPoojaId, filter]);

            const familySamagriRes = await db.query(`
                SELECT si.name->>'en' as item_name
                FROM ps.pooja_vidhi pv
                JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
                JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
                JOIN ps.vidhi_samagri vsa ON vv.id = vsa.vidhi_version_id
                JOIN ps.samagri_item si ON vsa.samagri_item_id = si.id
                WHERE pv.pooja_id = $1 AND s.name->>'en' = $2 AND vsa.supplied_by = 'family'
            `, [resolvedPoojaId, filter]);

            return {
                vidhiSteps: stepsRes.rows.map(r => r.step_name),
                samagriItems: samagriRes.rows.map(r => r.item_name),
                familyArranges: [
                    ...tasksRes.rows.map(r => r.task_name),
                    ...familySamagriRes.rows.map(r => r.item_name)
                ]
            };
        };

        let details = await fetchDetailsForSampradayam(mappedSampradayam);

        // Fallback logic if the specific sampradayam is empty
        if (details.vidhiSteps.length === 0 && details.samagriItems.length === 0) {
            if (mappedSampradayam !== 'Samanya (General)') {
                details = await fetchDetailsForSampradayam('Samanya (General)');
            }
            if (details.vidhiSteps.length === 0 && details.samagriItems.length === 0) {
                details = await fetchDetailsForSampradayam('Smartha');
            }
        }

        // FAQs from ps.vidhi_faq
        const faqRes = await db.query(`
            SELECT 
                f.id,
                f.question->>'en' as q,
                f.answer->>'en' as a
            FROM ps.pooja_vidhi pv
            JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id
            JOIN ps.vidhi_faq f ON vv.id = f.vidhi_version_id
            WHERE pv.pooja_id = $1
            ORDER BY f.sort_order ASC
        `, [resolvedPoojaId]);

        let faqs = faqRes.rows;
        if (faqs.length === 0) {
            const generalFaqRes = await db.query(`
                SELECT DISTINCT ON (f.question->>'en')
                    f.id,
                    f.question->>'en' as q,
                    f.answer->>'en' as a
                FROM ps.vidhi_faq f
                ORDER BY f.question->>'en', f.sort_order ASC
                LIMIT 5
            `);
            faqs = generalFaqRes.rows;
        }

        res.status(200).json({
            success: true,
            data: {
                id: pooja.id,
                code: pooja.code,
                title: pooja.title,
                subtitle: pooja.subtitle,
                desc: pooja.desc,
                category: pooja.category,
                price: priceText,
                duration: durationText,
                vidhiSteps: details.vidhiSteps,
                samagriItems: details.samagriItems,
                familyArranges: details.familyArranges,
                faqs: faqs
            }
        });
    } catch (err) {
        console.error('Error in getPoojaDetails:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching pooja details' });
    }
};

exports.getSampradayams = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, code, name->>'en' as name, name->>'te' as name_te, description->>'en' as description
            FROM ps.sampradayam
            ORDER BY CASE WHEN code = 'unknown' THEN 999 ELSE 1 END, name->>'en' ASC
        `);
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching sampradayams:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch sampradayams' });
    }
};

exports.getMuhurthams = async (req, res) => {
    try {
        const { poojaId } = req.query;
        let query = `
            SELECT 
                m.id, 
                m.pooja_id,
                m.starts_at, 
                m.ends_at, 
                m.lagnam, 
                m.note->>'en' as note, 
                m.quality,
                p.name->>'en' as pooja_name,
                p.name->>'te' as pooja_name_te
            FROM ps.muhurtham_suggestion m 
            LEFT JOIN ps.pooja p ON m.pooja_id = p.id
        `;
        const params = [];
        if (poojaId) {
            query += ` WHERE m.pooja_id::text = $1 OR p.code = $1 OR p.name->>'en' ILIKE '%' || $1 || '%'`;
            params.push(poojaId);
        }
        query += ` ORDER BY m.starts_at ASC`;
        let result = await db.query(query, params);

        if (result.rows.length === 0 && poojaId) {
            result = await db.query(`
                SELECT 
                    m.id, 
                    m.pooja_id,
                    m.starts_at, 
                    m.ends_at, 
                    m.lagnam, 
                    m.note->>'en' as note, 
                    m.quality,
                    p.name->>'en' as pooja_name,
                    p.name->>'te' as pooja_name_te
                FROM ps.muhurtham_suggestion m 
                LEFT JOIN ps.pooja p ON m.pooja_id = p.id
                ORDER BY m.starts_at ASC
            `);
        }

        const seenSlots = new Set();
        const formatted = [];

        for (const m of result.rows) {
            const start = new Date(m.starts_at);
            const end = new Date(m.ends_at);
            const dateStr = start.toLocaleDateString('en-US', {
                timeZone: 'Asia/Kolkata',
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
            const startTimeStr = start.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            const endTimeStr = end.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            const uniqueKey = `${dateStr}_${startTimeStr}_${endTimeStr}`.toLowerCase();
            if (seenSlots.has(uniqueKey)) {
                continue;
            }
            seenSlots.add(uniqueKey);

            formatted.push({
                id: m.id,
                poojaId: m.pooja_id,
                date: dateStr,
                time: `${startTimeStr} – ${endTimeStr}`,
                desc: `${m.lagnam} lagnam${m.note ? ' · ' + m.note : ''}`,
                tag: m.quality === 'best' ? 'Best' : 'Good',
                tagColor: m.quality === 'best' ? '#E6F4EA' : '#E8F0FE',
                tagTextColor: m.quality === 'best' ? '#137333' : '#1967D2',
                starts_at: m.starts_at,
                ends_at: m.ends_at,
                lagnam: m.lagnam
            });
        }

        return res.status(200).json({ success: true, data: formatted });
    } catch (err) {
        console.error('Error fetching muhurthams:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch muhurthams' });
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

exports.getCateringMenu = async (req, res) => {
    try {
        const menusRes = await db.query(`
            SELECT id, name->>'en' as name, name->>'te' as name_te, price_per_plate, min_guests, diet 
            FROM ps.caterer_menu 
            WHERE status = 'active' AND diet = 'satvik'
            ORDER BY price_per_plate ASC
        `);

        const itemsRes = await db.query(`
            SELECT cm.name->>'en' as menu_type, fi.name->>'en' as dish_name, fc.name->>'en' as category
            FROM ps.caterer_menu_item cmi
            JOIN ps.caterer_menu cm ON cmi.caterer_menu_id = cm.id
            JOIN ps.food_item fi ON cmi.food_item_id = fi.id
            LEFT JOIN ps.food_category fc ON fi.category_id = fc.id
            WHERE cm.status = 'active'
            ORDER BY cm.name->>'en', fc.name->>'en', fi.name->>'en'
        `);

        const menusWithDishes = menusRes.rows.map(m => {
            const dishes = itemsRes.rows.filter(it => it.menu_type === m.name);
            return {
                ...m,
                price: Number(m.price_per_plate),
                dishes: dishes.map(d => d.dish_name)
            };
        });

        res.status(200).json({ success: true, menus: menusWithDishes });
    } catch (err) {
        console.error('Error fetching catering menu:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching catering menu' });
    }
};
