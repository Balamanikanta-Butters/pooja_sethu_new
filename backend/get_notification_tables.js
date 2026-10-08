const db = require('./config/db');

async function getSchemas() {
  const tables = ['notification_log', 'notification_template'];
  
  for (const table of tables) {
    const res = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'ps' AND table_name = $1
      ORDER BY ordinal_position
    `, [table]);
    
    console.log(`\nTable: ${table}`);
    console.table(res.rows);
  }
  process.exit(0);
}

getSchemas().catch(console.error);
