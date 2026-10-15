const db = require('../config/db');

exports.getContent = async (req, res) => {
  const { type } = req.params;

  try {
    // 1. Fetch from ps.policy_document table
    const result = await db.query(
      `SELECT body->>'en' as content 
       FROM ps.policy_document 
       WHERE code = $1 AND status = 'active' 
       ORDER BY effective_from DESC 
       LIMIT 1`,
      [type]
    );

    if (result.rows.length > 0 && result.rows[0].content) {
      return res.json({ success: true, content: result.rows[0].content });
    }

    // 2. Fetch from ps.app_config table
    const configResult = await db.query(
      `SELECT value FROM ps.app_config WHERE key = $1 LIMIT 1`,
      [`content_${type}`]
    );

    if (configResult.rows.length > 0 && configResult.rows[0].value) {
      return res.json({ success: true, content: configResult.rows[0].value });
    }

    return res.status(404).json({ success: false, message: 'Policy document not found in database' });
  } catch (err) {
    console.error('Error fetching content from database:', err);
    return res.status(500).json({ success: false, message: 'Database error fetching policy document' });
  }
};
