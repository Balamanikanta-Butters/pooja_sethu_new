const pool = require('../config/db');

exports.getPanchangam = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ps, public');
    const result = await client.query('SELECT * FROM panchangam_day ORDER BY day ASC LIMIT 7');
    res.json({ success: true, panchangam: result.rows });
  } catch (error) {
    console.error('Error fetching panchangam:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};
