const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@192.168.88.6:5432/pooja_sethu',
  // ssl: { rejectUnauthorized: false } // Uncomment if SSL is required
});

pool.on('connect', (client) => {
  client.query('SET search_path TO ps, public');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
