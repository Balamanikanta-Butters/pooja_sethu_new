const pool = require('../config/db');

exports.getHomeData = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');

    // 1. Home banners from ps.home_banner
    const bannersResult = await client.query(`
      SELECT 
        b.id, 
        b.slot, 
        b.content->>'en' as title, 
        b.content->>'type' as type,
        b.target_pooja_id, 
        b.starts_at, 
        b.ends_at, 
        b.sort_order,
        p.name->>'en' as target_pooja_name
      FROM ps.home_banner b
      LEFT JOIN ps.pooja p ON b.target_pooja_id = p.id
      WHERE b.status = 'active'
        AND COALESCE(b.content->>'type', '') != 'panchangam_auto'
        AND COALESCE(b.content->>'en', '') != ''
      ORDER BY b.sort_order ASC
    `);

    // 2. Categories from ps.pooja_category
    const categoriesResult = await client.query(`
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

    // 3. Popular Poojas from ps.pooja + vidhi_version
    const poojaResult = await client.query(`
      SELECT 
        p.id, 
        p.code, 
        p.name->>'en' as title, 
        p.name->>'te' as subtitle, 
        p.significance->>'en' as "desc", 
        c.name->>'en' as category,
        (SELECT MIN(vv.dakshina_min) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as min_price,
        (SELECT MAX(vv.dakshina_max) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as max_price,
        (SELECT MAX(vv.duration_minutes) FROM ps.pooja_vidhi pv JOIN ps.vidhi_version vv ON pv.current_version_id = vv.id WHERE pv.pooja_id = p.id) as duration
      FROM ps.pooja p
      LEFT JOIN ps.pooja_category c ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY c.sort_order ASC, p.name->>'en' ASC
      LIMIT 8
    `);

    const formattedPopularPoojas = poojaResult.rows.map(row => {
      let durationText = '2 hrs';
      if (row.duration) {
        const hrs = Math.floor(row.duration / 60);
        const mins = row.duration % 60;
        durationText = hrs > 0 ? (mins > 0 ? `${hrs}.${mins / 6} hrs` : `${hrs} hrs`) : `${mins} min`;
      }
      let priceText = 'Price on Request';
      if (row.min_price && row.max_price) {
        priceText = `From ₹${Number(row.min_price).toLocaleString('en-IN')}`;
      } else if (row.min_price) {
        priceText = `From ₹${Number(row.min_price).toLocaleString('en-IN')}`;
      }

      return {
        id: row.id,
        code: row.code,
        title: row.title,
        subtitle: row.subtitle,
        desc: row.desc,
        category: row.category,
        price: priceText,
        duration: durationText,
        sampradayam: 'All Sampradayams'
      };
    });

    // 4. Upcoming Muhurthams from ps.muhurtham_suggestion + ps.pooja
    const muhurthamResult = await client.query(`
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
      LIMIT 4
    `);

    const seenMuhurthamKeys = new Set();
    const formattedMuhurthams = [];

    for (const m of muhurthamResult.rows) {
      const start = new Date(m.starts_at);
      const end = new Date(m.ends_at);
      const month = start.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short' }).toUpperCase();
      const day = start.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: '2-digit' });
      const weekday = start.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' });
      const startTime = start.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
      const endTime = end.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
      const isBest = m.quality === 'best';

      const key = `${month}_${day}_${startTime}_${endTime}`.toLowerCase();
      if (seenMuhurthamKeys.has(key)) {
        continue;
      }
      seenMuhurthamKeys.add(key);

      formattedMuhurthams.push({
        id: m.id,
        poojaId: m.pooja_id,
        month,
        day,
        weekday,
        title: m.pooja_name || 'Auspicious Ceremony',
        time: `${startTime} – ${endTime}`,
        lagnam: `${m.lagnam} lagnam${m.note ? ' · ' + m.note : ''}`,
        badge: isBest ? 'Best' : 'Good',
        badgeBg: isBest ? '#DCFCE7' : '#E0F2FE',
        badgeColor: isBest ? '#15803D' : '#0369A1',
        icon: 'home-outline'
      });

      if (formattedMuhurthams.length >= 4) break;
    }

    // 5. Festivals from ps.panchangam_day
    const festivalsResult = await client.query(`
      SELECT 
        day, 
        vaaram, 
        masam, 
        paksham, 
        tithi, 
        nakshatram, 
        significance 
      FROM ps.panchangam_day 
      WHERE significance IS NOT NULL 
        AND significance->>'en' IS NOT NULL 
      ORDER BY day ASC 
      LIMIT 8
    `);

    // 6. Today's Panchangam from ps.panchangam_day (nearest day to today)
    const panchangamResult = await client.query(`
      SELECT *
      FROM ps.panchangam_day
      ORDER BY ABS(day - CURRENT_DATE) ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      banners: bannersResult.rows,
      categories: categoriesResult.rows,
      popularPoojas: formattedPopularPoojas,
      upcomingMuhurthams: formattedMuhurthams,
      festivals: festivalsResult.rows,
      todaysPanchangam: panchangamResult.rows[0] || null,
    });
  } catch (err) {
    console.error('Error fetching home data:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};
