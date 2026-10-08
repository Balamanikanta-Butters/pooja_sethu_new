const db = require('./config/db');
db.query("SELECT * FROM ps.panchangam_day").then(res => { console.log(JSON.stringify(res.rows, null, 2)); process.exit(0); });
