const pool = require('../config/db');

exports.getPanchangam = async (req, res) => {
  try {
    const { date } = req.query;
    let query = 'SELECT * FROM ps.panchangam_day';
    let params = [];
    if (date) {
      query += ' WHERE day::date = $1::date';
      params.push(date);
    } else {
      query += ' ORDER BY ABS(day - CURRENT_DATE) ASC LIMIT 7';
    }
    const result = await pool.query(query, params);
    res.json({ success: true, panchangam: result.rows, today: result.rows[0] || null });
  } catch (error) {
    console.error('Error fetching panchangam:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
