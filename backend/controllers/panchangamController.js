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
      query += ' ORDER BY day ASC LIMIT 30';
    }
    const result = await pool.query(query, params);
    const todayRow = result.rows.find(r => new Date(r.day).toDateString() === new Date().toDateString()) || result.rows[0] || null;
    res.json({
      success: true,
      panchangam: result.rows,
      data: result.rows,
      today: todayRow
    });
  } catch (error) {
    console.error('Error fetching panchangam:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getPanchangamToday = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ps.panchangam_day
      ORDER BY ABS(day - CURRENT_DATE) ASC
      LIMIT 1
    `);
    const today = result.rows[0] || null;
    res.json({
      success: true,
      panchangam: today,
      today: today,
      data: today
    });
  } catch (error) {
    console.error('Error fetching today panchangam:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
