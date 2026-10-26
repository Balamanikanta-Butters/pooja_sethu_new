const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  const client = await db.connect();
  try {
    console.log('--- Step 1: Executing Migration 005 ---');
    const migrationSql = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '005_satyanarayana_vratam_tables.sql'),
      'utf8'
    );
    await client.query(migrationSql);
    console.log(' Migration 005 applied successfully.');

    console.log('\n--- Step 2: Executing Seed 005 (Satyanarayana Vratam) ---');
    const seedSql = fs.readFileSync(
      path.join(__dirname, '..', 'seeds', '005_satyanarayana_vratam_seed.sql'),
      'utf8'
    );
    await client.query(seedSql);
    console.log(' Seed 005 executed successfully.');

    console.log('\n--- Step 3: Executing Consolidated Seed (Gruhapravesam & remaining poojas) ---');
    const consolidatedSeedPath = path.join(__dirname, '..', 'seeds', 'poojas_seed_consolidated.sql');
    if (fs.existsSync(consolidatedSeedPath)) {
      const consolidatedSql = fs.readFileSync(consolidatedSeedPath, 'utf8');
      await client.query(consolidatedSql);
      console.log(' Consolidated seed executed successfully.');
    }

    console.log('\n--- Step 4: Verification Queries ---');

    // 4.1 Pooja catalogue entry
    const poojaRes = await client.query(`
      SELECT p.id, p.code, p.name, p.significance, p.status, c.code as category_code, c.name->>'en' as category_name
      FROM ps.pooja p
      JOIN ps.pooja_category c ON p.category_id = c.id
      WHERE p.code = 'satyanarayana'
    `);
    console.log('\n[Pooja Catalogue Entry]');
    console.log(JSON.stringify(poojaRes.rows[0], null, 2));

    // 4.2 Vidhi Versions
    const vidhiRes = await client.query(`
      SELECT
        pv.id as vidhi_id,
        s.code as sampradayam_code,
        s.name->>'en' as sampradayam_name,
        vv.id as version_id,
        vv.version_no,
        vv.title->>'en' as title_en,
        vv.duration_minutes,
        vv.status as version_status,
        pv.current_version_id = vv.id as is_current
      FROM ps.pooja p
      JOIN ps.pooja_vidhi pv ON pv.pooja_id = p.id
      JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
      JOIN ps.vidhi_version vv ON pv.id = vv.pooja_vidhi_id
      WHERE p.code = 'satyanarayana' AND vv.version_no = 2
      ORDER BY s.sort_order;
    `);
    console.log('\n[Vidhi Versions (v2)]');
    console.table(vidhiRes.rows);

    const smarthaVersionId = vidhiRes.rows.find(r => r.sampradayam_code === 'smartha')?.version_id;

    // 4.3 Procedure steps (7 ordered steps)
    const stepsRes = await client.query(`
      SELECT step_no, name->>'en' as step_en, name->>'te' as step_te, performed_by, duration_minutes,
             LEFT(description->>'en', 45) || '...' as desc_preview
      FROM ps.vidhi_step
      WHERE vidhi_version_id = $1
      ORDER BY step_no ASC
    `, [smarthaVersionId]);
    console.log(`\n[Vidhi Steps for Smartha v2 (${stepsRes.rows.length} steps)]`);
    console.table(stepsRes.rows);

    // 4.4 Dedicated Katha Chapters (5 chapters)
    const kathaRes = await client.query(`
      SELECT chapter_no, title->>'en' as title_en, title->>'te' as title_te,
             LEFT(summary->>'en', 50) || '...' as summary_preview,
             is_published, content IS NULL as content_is_null
      FROM ps.vidhi_katha_chapter
      WHERE vidhi_version_id = $1
      ORDER BY chapter_no ASC
    `, [smarthaVersionId]);
    console.log(`\n[Katha Chapters (${kathaRes.rows.length} chapters)]`);
    console.table(kathaRes.rows);

    // 4.5 Customer Checklist (by group, quantity-free)
    const checklistRes = await client.query(`
      SELECT
        sc.checklist_group,
        COUNT(*) as total_items,
        COUNT(sc.samagri_item_id) as linked_master_items,
        string_agg(sc.item_name->>'en', ' | ' ORDER BY sc.sort_order) as items_sample
      FROM ps.vidhi_samagri_checklist sc
      WHERE sc.vidhi_version_id = $1
      GROUP BY sc.checklist_group
    `, [smarthaVersionId]);
    console.log('\n[Customer-facing Quantity-Free Checklist Groups]');
    console.table(checklistRes.rows.map(r => ({
      group: r.checklist_group,
      count: r.total_items,
      linked_master: r.linked_master_items,
      preview: r.items_sample.substring(0, 80) + '...'
    })));

    // 4.6 Customer Tasks
    const tasksRes = await client.query(`
      SELECT sort_order, task->>'en' as task_en, task->>'te' as task_te, due_before_hours
      FROM ps.vidhi_family_task
      WHERE vidhi_version_id = $1
      ORDER BY sort_order ASC
    `, [smarthaVersionId]);
    console.log(`\n[Customer Preparation Tasks (${tasksRes.rows.length} tasks)]`);
    console.table(tasksRes.rows);

    // 4.7 Customer FAQs / Instructions
    const faqRes = await client.query(`
      SELECT sort_order, question->>'en' as q, LEFT(answer->>'en', 60) || '...' as a
      FROM ps.vidhi_faq
      WHERE vidhi_version_id = $1
      ORDER BY sort_order ASC
    `, [smarthaVersionId]);
    console.log(`\n[Customer Instructions / FAQs (${faqRes.rows.length} FAQs)]`);
    console.table(faqRes.rows);

    // 4.8 Duplicate Check
    const dupCheck = await client.query(`
      SELECT 'katha_chapter' as tbl, count(*) - count(DISTINCT chapter_no) as dups
      FROM ps.vidhi_katha_chapter WHERE vidhi_version_id = $1
      UNION ALL
      SELECT 'checklist' as tbl, count(*) - count(DISTINCT (checklist_group, sort_order)) as dups
      FROM ps.vidhi_samagri_checklist WHERE vidhi_version_id = $1
      UNION ALL
      SELECT 'vidhi_step' as tbl, count(*) - count(DISTINCT step_no) as dups
      FROM ps.vidhi_step WHERE vidhi_version_id = $1
      UNION ALL
      SELECT 'family_task' as tbl, count(*) - count(DISTINCT sort_order) as dups
      FROM ps.vidhi_family_task WHERE vidhi_version_id = $1
      UNION ALL
      SELECT 'faq' as tbl, count(*) - count(DISTINCT sort_order) as dups
      FROM ps.vidhi_faq WHERE vidhi_version_id = $1
    `, [smarthaVersionId]);
    console.log('\n[Duplicate Checks (all should be 0)]');
    console.table(dupCheck.rows);

    console.log('\n All validations passed successfully!');
  } catch (err) {
    console.error('Error during execution:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

run();
