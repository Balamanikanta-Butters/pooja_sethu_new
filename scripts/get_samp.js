const db = require('./config/db');
db.query('SELECT * FROM ps.sampradayam')
  .then(res => { console.log(JSON.stringify(res.rows, null, 2)); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });
