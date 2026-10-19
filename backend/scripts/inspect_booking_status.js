const pool = require('../config/db');

async function run() {
  try {
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conrelid = 'ps.booking'::regclass;
    `);
    console.log('CONSTRAINTS:', res.rows);

    const resActor = await pool.query(`
      SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'actor_type';
    `);
    console.log('ACTOR TYPES:', resActor.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
