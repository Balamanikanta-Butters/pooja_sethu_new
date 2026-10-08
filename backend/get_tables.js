const db = require('./config/db');
db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='ps'").then(res => { console.log(JSON.stringify(res.rows, null, 2)); process.exit(0); });
