const { Pool } = require('pg');
require('dotenv').config();

let connStr = process.env.DATABASE_URL || 'postgresql://postgres:kasturi@192.168.88.13:5432/pooja_sethu';
if (!connStr.includes('options=')) {
  connStr += (connStr.includes('?') ? '&' : '?') + 'options=-c%20search_path%3Dps,public';
}

const pool = new Pool({
  connectionString: connStr
});

// Removed pool.on connect to prevent client.query concurrency issues

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
