const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let connStr = process.env.DATABASE_URL || 'postgresql://postgres:kasturi@192.168.88.13:5432/pooja_sethu';
if (!connStr.includes('options=')) {
  connStr += (connStr.includes('?') ? '&' : '?') + 'options=-c%20search_path%3Dps,public';
}

const pool = new Pool({
  connectionString: connStr,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 15000,
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
