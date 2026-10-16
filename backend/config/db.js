const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let connStr = process.env.DATABASE_URL || 'postgresql://postgres:postgres@192.168.88.10:5432/pooja_sethu';
if (!connStr.includes('options=')) {
  connStr += (connStr.includes('?') ? '&' : '?') + 'options=-c%20search_path%3Dps,public';
}

const pool = new Pool({
  connectionString: connStr,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.warn('PostgreSQL client socket error (handled):', err.message);
  });
});

pool.on('error', (err) => {
  console.warn('PostgreSQL pool idle error (handled):', err.message);
});

const isTransientError = (err) => {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = (err.code || '').toLowerCase();
  return (
    msg.includes('connection terminated') ||
    msg.includes('connection timeout') ||
    msg.includes('timeout exceeded') ||
    code === 'econnreset' ||
    code === '57p01' // admin shutdown
  );
};

module.exports = {
  query: async (text, params) => {
    try {
      return await pool.query(text, params);
    } catch (err) {
      if (isTransientError(err)) {
        // Wait 300ms and retry once with fresh connection
        await new Promise((resolve) => setTimeout(resolve, 300));
        return await pool.query(text, params);
      }
      throw err;
    }
  },
  connect: () => pool.connect(),
};
