const pool = require('../config/db');

exports.getHomeData = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');

    // Popular poojas
    const poojaResult = await client.query('SELECT id, code, name, description, tags, slug FROM pooja LIMIT 5');

    // Upcoming muhurthams
    const muhurthamResult = await client.query('SELECT date, start_time, end_time, details FROM muhurtham_suggestion WHERE date >= NOW() ORDER BY date ASC LIMIT 5');

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
