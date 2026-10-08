const db = require('./config/db');

async function check() {
    try {
        const t1 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'ps' AND table_name = 'purohit_language'");
        console.log('purohit_language cols:', t1.rows);
        const t2 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'ps' AND table_name = 'language'");
        console.log('language cols:', t2.rows);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();
