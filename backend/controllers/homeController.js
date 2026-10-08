const pool = require('../config/db');

exports.getHomeData = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');

    // Popular poojas
    // Removed description, tags, slug since they do not exist in pooja
    const poojaResult = await client.query('SELECT id, code, name, significance, image_url FROM pooja WHERE status = \'active\' LIMIT 5');

    // Upcoming muhurthams
    const muhurthamResult = await client.query('SELECT starts_at, ends_at, lagnam, note, quality FROM muhurtham_suggestion WHERE starts_at >= NOW() ORDER BY starts_at ASC LIMIT 5');

    // Festivals
    const festivalsResult = await client.query(`
        SELECT day, significance 
        FROM panchangam_day 
        WHERE significance IS NOT NULL 
          AND significance->>'en' IS NOT NULL 
          AND day >= NOW()
        ORDER BY day ASC 
        LIMIT 5
    `);

    res.json({
      success: true,
      popularPoojas: poojaResult.rows,
      upcomingMuhurthams: muhurthamResult.rows,
      festivals: festivalsResult.rows,
    });
  } catch (err) {
    console.error('Error fetching home data:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};
