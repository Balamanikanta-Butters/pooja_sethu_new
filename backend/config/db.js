const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let connStr = process.env.DATABASE_URL || 'postgresql://postgres:postgres@192.168.88.10:5432/pooja_sethu';
if (!connStr.includes('options=')) {
  connStr += (connStr.includes('?') ? '&' : '?') + 'options=-c%20search_path%3Dps,public';
}

const pool = new Pool({
  connectionString: connStr,
  max: 5,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.warn('PostgreSQL client socket error (handled):', err.message);
  });
});

pool.on('error', (err) => {
  console.warn('PostgreSQL pool idle error (handled):', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
