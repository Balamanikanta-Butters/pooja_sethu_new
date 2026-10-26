-- Seed 005: Satyanarayana Vratam Catalogue, Procedures, Katha Chapters, and Checklist
-- All operations are idempotent, transactional, and follow the database's approval workflow.

BEGIN;

-- ============================================================================
-- 1. CATALOGUE ENTRY (ps.pooja)
-- ============================================================================
DO $$
DECLARE
    v_category_id UUID;
BEGIN
    SELECT id INTO v_category_id FROM ps.pooja_category WHERE code = 'vratam';

    -- Insert if not present
    IF NOT EXISTS (SELECT 1 FROM ps.pooja WHERE code = 'satyanarayana') THEN
        INSERT INTO ps.pooja (
            category_id,
            code,
            name,
            significance,
            is_muhurtham_required,
            is_tithi_based,
            status
        ) VALUES (
            v_category_id,
            'satyanarayana',
            jsonb_build_object(
                'en', 'Satyanarayana Vratam',
                'te', 'సత్యనారాయణ వ్రతం'
            ),
            jsonb_build_object(
                'en', 'Complete Satyanarayana Vratam with Kalasa Pooja, Shodasopachara Pooja, five chapters of the Vratha Katha, prasadam offering, and Harathi.',
                'te', 'కలశ పూజ, షోడశోపచార పూజ, ఐదు అధ్యాయాల వ్రత కథ, ప్రసాదం సమర్పణ మరియు హారతితో కూడిన సంపూర్ణ సత్యనారాయణ వ్రతం.',
                'region', 'Telugu States',
                'duration', 'Approximately 90–120 minutes',
                'occasions', jsonb_build_array(
                    'Gruhapravesam',
                    'Marriage',
                    'Birthdays',
                    'Business openings',
                    'Pournami',
                    'Auspicious occasions'
                )
            ),
            TRUE,
            FALSE,
            'active'::ps.record_status
        );
    ELSE
        -- Update existing entry to ensure current content
        UPDATE ps.pooja
        SET
            name = jsonb_build_object(
                'en', 'Satyanarayana Vratam',
                'te', 'సత్యనారాయణ వ్రతం'
            ),
            significance = jsonb_build_object(
                'en', 'Complete Satyanarayana Vratam with Kalasa Pooja, Shodasopachara Pooja, five chapters of the Vratha Katha, prasadam offering, and Harathi.',
                'te', 'కలశ పూజ, షోడశోపచార పూజ, ఐదు అధ్యాయాల వ్రత కథ, ప్రసాదం సమర్పణ మరియు హారతితో కూడిన సంపూర్ణ సత్యనారాయణ వ్రతం.',
                'region', 'Telugu States',
                'duration', 'Approximately 90–120 minutes',
                'occasions', jsonb_build_array(
                    'Gruhapravesam',
                    'Marriage',
                    'Birthdays',
                    'Business openings',
                    'Pournami',
                    'Auspicious occasions'
                )
            ),
            category_id = v_category_id,
            updated_at = NOW()
        WHERE code = 'satyanarayana';
    END IF;
END $$;


-- ============================================================================
-- 2. MASTER SAMAGRI ITEMS (ps.samagri_item) - Ensure missing items exist
-- ============================================================================
DO $$
DECLARE
    v_fruits_cat_id UUID;
    v_grains_cat_id UUID;
    v_pantry_cat_id UUID;
    v_cloth_cat_id UUID;
    v_special_cat_id UUID;
BEGIN
    SELECT id INTO v_fruits_cat_id FROM ps.samagri_category WHERE code = 'fruits';
    SELECT id INTO v_grains_cat_id FROM ps.samagri_category WHERE code = 'grains';
    SELECT id INTO v_pantry_cat_id FROM ps.samagri_category WHERE code = 'pantry';
    SELECT id INTO v_cloth_cat_id FROM ps.samagri_category WHERE code = 'cloth';
    SELECT id INTO v_special_cat_id FROM ps.samagri_category WHERE code = 'special';

    -- Apples
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_fruits_cat_id,
        'SAM-APPLE',
        jsonb_build_object('en', 'Apples', 'te', 'ఆపిల్ పండ్లు'),
        'pc',
        TRUE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Cardamom
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_pantry_cat_id,
        'SAM-CARDAMOM',
        jsonb_build_object('en', 'Cardamom', 'te', 'యాలకులు'),
        'g',
        FALSE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Cashews
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_pantry_cat_id,
        'SAM-CASHEW',
        jsonb_build_object('en', 'Cashews', 'te', 'జీడిపప్పు'),
        'g',
        FALSE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Raisins
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_pantry_cat_id,
        'SAM-RAISIN',
        jsonb_build_object('en', 'Raisins', 'te', 'కిస్‌మిస్'),
        'g',
        FALSE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Wheat rava
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_grains_cat_id,
        'SAM-WHEATRAVA',
        jsonb_build_object('en', 'Wheat rava', 'te', 'గోధుమ రవ్వ'),
        'g',
        FALSE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Rupee coins
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_reusable, is_stocked, status)
    VALUES (
        v_special_cat_id,
        'SAM-COINS',
        jsonb_build_object('en', 'Rupee coins', 'te', 'రూపాయి నాణాలు'),
        'pc',
        FALSE,
        TRUE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;

    -- Deity new clothes (optional)
    INSERT INTO ps.samagri_item (category_id, sku, name, stock_uom, is_perishable, is_stocked, status)
    VALUES (
        v_cloth_cat_id,
        'SAM-DEITYCLOTH',
        jsonb_build_object('en', 'New clothes for the deity (optional)', 'te', 'స్వామివారికి నూతన వస్త్రాలు'),
        'set',
        FALSE,
        TRUE,
        'active'::ps.record_status
    )
    ON CONFLICT (sku) DO UPDATE
    SET name = EXCLUDED.name, status = 'active'::ps.record_status;
END $$;


-- ============================================================================
-- 3. VIDHI VERSIONS, STEPS, CHAPTERS, AND CHECKLIST
-- Applied to Smartha (primary Telugu sampradayam) and Samanya (General)
-- ============================================================================
DO $$
DECLARE
    v_pooja_id UUID;
    v_approver_id UUID;
    v_target_vidhis RECORD;
    v_version_id UUID;
    v_old_version_id UUID;

    -- Item UUID variables for linking checklist
    v_item_photo UUID;
    v_item_kalasham UUID;
    v_item_coconut UUID;
    v_item_turmeric UUID;
    v_item_kumkum UUID;
    v_item_sandal UUID;
    v_item_betel UUID;
    v_item_betelnut UUID;
    v_item_garland UUID;
    v_item_flowers UUID;
    v_item_tulasi UUID;
    v_item_banana UUID;
    v_item_apple UUID;
    v_item_rice UUID;
    v_item_thoram UUID;
    v_item_agarbatti UUID;
    v_item_camphor UUID;
    v_item_lampoil UUID;
    v_item_wheatrava UUID;
    v_item_sugar UUID;
    v_item_milk UUID;
    v_item_ghee UUID;
    v_item_cardamom UUID;
    v_item_cashew UUID;
    v_item_raisin UUID;
    v_item_curd UUID;
    v_item_honey UUID;
    v_item_coins UUID;
    v_item_deitycloth UUID;
    v_item_plantainleaf UUID;
BEGIN
    SELECT id INTO v_pooja_id FROM ps.pooja WHERE code = 'satyanarayana';

    -- Lookup approver
    SELECT id INTO v_approver_id
    FROM ps.admin_user
    WHERE email LIKE 'approver.smartha%' OR email LIKE 'catalogue%'
    ORDER BY created_at ASC
    LIMIT 1;

    -- Lookup item IDs for foreign key reference
    SELECT id INTO v_item_photo FROM ps.samagri_item WHERE sku = 'SAM-SNPHOTO';
    SELECT id INTO v_item_kalasham FROM ps.samagri_item WHERE sku = 'SAM-KALASHAM';
    SELECT id INTO v_item_coconut FROM ps.samagri_item WHERE sku = 'SAM-COCONUT';
    SELECT id INTO v_item_turmeric FROM ps.samagri_item WHERE sku = 'SAM-TURMERIC';
    SELECT id INTO v_item_kumkum FROM ps.samagri_item WHERE sku = 'SAM-KUMKUM';
    SELECT id INTO v_item_sandal FROM ps.samagri_item WHERE sku = 'SAM-SANDAL';
    SELECT id INTO v_item_betel FROM ps.samagri_item WHERE sku = 'SAM-BETEL';
    SELECT id INTO v_item_betelnut FROM ps.samagri_item WHERE sku = 'SAM-BETELNUT';
    SELECT id INTO v_item_garland FROM ps.samagri_item WHERE sku = 'SAM-GARLAND';
    SELECT id INTO v_item_flowers FROM ps.samagri_item WHERE sku = 'SAM-FLOWERS';
    SELECT id INTO v_item_tulasi FROM ps.samagri_item WHERE sku = 'SAM-TULASI';
    SELECT id INTO v_item_banana FROM ps.samagri_item WHERE sku = 'SAM-BANANA';
    SELECT id INTO v_item_apple FROM ps.samagri_item WHERE sku = 'SAM-APPLE';
    SELECT id INTO v_item_rice FROM ps.samagri_item WHERE sku = 'SAM-RICE';
    SELECT id INTO v_item_thoram FROM ps.samagri_item WHERE sku = 'SAM-THORAM';
    SELECT id INTO v_item_agarbatti FROM ps.samagri_item WHERE sku = 'SAM-AGARBATTI';
    SELECT id INTO v_item_camphor FROM ps.samagri_item WHERE sku = 'SAM-CAMPHOR';
    SELECT id INTO v_item_lampoil FROM ps.samagri_item WHERE sku = 'SAM-LAMPOIL';
    SELECT id INTO v_item_wheatrava FROM ps.samagri_item WHERE sku = 'SAM-WHEATRAVA';
    SELECT id INTO v_item_sugar FROM ps.samagri_item WHERE sku = 'SAM-SUGAR';
    SELECT id INTO v_item_milk FROM ps.samagri_item WHERE sku = 'SAM-MILK';
    SELECT id INTO v_item_ghee FROM ps.samagri_item WHERE sku = 'SAM-GHEE';
    SELECT id INTO v_item_cardamom FROM ps.samagri_item WHERE sku = 'SAM-CARDAMOM';
    SELECT id INTO v_item_cashew FROM ps.samagri_item WHERE sku = 'SAM-CASHEW';
    SELECT id INTO v_item_raisin FROM ps.samagri_item WHERE sku = 'SAM-RAISIN';
    SELECT id INTO v_item_curd FROM ps.samagri_item WHERE sku = 'SAM-CURD';
    SELECT id INTO v_item_honey FROM ps.samagri_item WHERE sku = 'SAM-HONEY';
    SELECT id INTO v_item_coins FROM ps.samagri_item WHERE sku = 'SAM-COINS';
    SELECT id INTO v_item_deitycloth FROM ps.samagri_item WHERE sku = 'SAM-DEITYCLOTH';
    SELECT id INTO v_item_plantainleaf FROM ps.samagri_item WHERE sku = 'SAM-PLANTAINLEAF';

    -- Loop through traditions for Satyanarayana Vratam
    FOR v_target_vidhis IN
        SELECT pv.id AS pooja_vidhi_id, s.code AS sampradayam_code, s.name->>'en' AS sampradayam_name, pv.current_version_id
        FROM ps.pooja_vidhi pv
        JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
        WHERE pv.pooja_id = v_pooja_id
    LOOP
        v_old_version_id := v_target_vidhis.current_version_id;

        -- Check if version 2 already exists
        SELECT id INTO v_version_id
        FROM ps.vidhi_version
        WHERE pooja_vidhi_id = v_target_vidhis.pooja_vidhi_id AND version_no = 2;

        IF v_version_id IS NULL THEN
            -- Step 1: Create Version 2 in 'draft' status so children can be inserted
            INSERT INTO ps.vidhi_version (
                pooja_vidhi_id,
                version_no,
                title,
                summary,
                source_text,
                duration_minutes,
                min_purohits,
                dakshina_min,
                dakshina_max,
                needs_homa_kundam,
                status,
                approved_by,
                approved_at,
                effective_from
            ) VALUES (
                v_target_vidhis.pooja_vidhi_id,
                2,
                jsonb_build_object(
                    'en', 'Satyanarayana Vratam · ' || v_target_vidhis.sampradayam_name || ' Vidhi',
                    'te', 'శ్రీ సత్యనారాయణ వ్రతం · ' || CASE
                        WHEN v_target_vidhis.sampradayam_code = 'smartha' THEN 'స్మార్త'
                        WHEN v_target_vidhis.sampradayam_code = 'madhva' THEN 'మాధ్వ'
                        WHEN v_target_vidhis.sampradayam_code = 'srivaishnava' THEN 'శ్రీవైష్ణవ'
                        ELSE 'సామాన్య'
                    END || ' విధి'
                ),
                jsonb_build_object(
                    'en', 'Complete Satyanarayana Vratam with Kalasa Pooja, Shodasopachara Pooja, five chapters of the Vratha Katha, prasadam offering, and Harathi.',
                    'te', 'కలశ పూజ, షోడశోపచార పూజ, ఐదు అధ్యాయాల వ్రత కథ, ప్రసాదం సమర్పణ మరియు హారతితో కూడిన సంపూర్ణ సత్యనారాయణ వ్రతం.'
                ),
                'Skanda Purana, Reva Khanda (' || v_target_vidhis.sampradayam_name || ')',
                120,
                1,
                2600.00,
                3900.00,
                FALSE,
                'draft'::ps.vidhi_status,
                v_approver_id,
                NULL,
                NULL
            )
            RETURNING id INTO v_version_id;
        ELSE
            -- In case of re-seed, temporarily set draft to allow child updates
            UPDATE ps.vidhi_version
            SET status = 'draft'::ps.vidhi_status
            WHERE id = v_version_id;
        END IF;

        -- --------------------------------------------------------------------
        -- A. COPY VERIFIED FOOD RULES & MANDATORY SAMAGRI FROM OLD VERSION
        -- (Ensures vidhi_publish_guard constraints are fully met!)
        -- --------------------------------------------------------------------
        IF v_old_version_id IS NOT NULL AND v_old_version_id != v_version_id THEN
            -- Copy food rules
            INSERT INTO ps.vidhi_food_rule (
                vidhi_version_id,
                vidhi_step_id,
                food_item_id,
                food_category_id,
                role,
                rule,
                qty_fixed,
                qty_per_guest,
                uom,
                diet_required,
                reason
            )
            SELECT
                v_version_id,
                NULL,
                food_item_id,
                food_category_id,
                role,
                rule,
                qty_fixed,
                qty_per_guest,
                uom,
                diet_required,
                reason
            FROM ps.vidhi_food_rule
            WHERE vidhi_version_id = v_old_version_id
            ON CONFLICT DO NOTHING;

            -- Copy verified kit inventory items
            INSERT INTO ps.vidhi_samagri (
                vidhi_version_id,
                samagri_item_id,
                quantity,
                uom,
                per_guest_qty,
                supplied_by,
                is_mandatory,
                substitute_item_id,
                note
            )
            SELECT
                v_version_id,
                samagri_item_id,
                quantity,
                uom,
                per_guest_qty,
                supplied_by,
                is_mandatory,
                substitute_item_id,
                note
            FROM ps.vidhi_samagri
            WHERE vidhi_version_id = v_old_version_id
            ON CONFLICT (vidhi_version_id, samagri_item_id, vidhi_step_id) DO NOTHING;
        END IF;

        -- --------------------------------------------------------------------
        -- B. 7 ORDERED VIDHI STEPS (ps.vidhi_step)
        -- --------------------------------------------------------------------
        -- Step 1: Sankalpam
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            1,
            jsonb_build_object('en', 'Sankalpam', 'te', 'సంకల్పం'),
            jsonb_build_object(
                'en', 'Formal solemn vow and declaration of intent by the Karta and family with names, gotras, and auspicious astrological timings.',
                'te', 'కర్త మరియు కుటుంబ సభ్యులు తమ గోత్ర నామాలు, తిథి వార నక్షత్రములను ఉచ్చరిస్తూ వ్రత సంకల్పం చేయడం.'
            ),
            10,
            'karta',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 2: Ganapathi Pooja
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            2,
            jsonb_build_object('en', 'Ganapathi Pooja', 'te', 'గణపతి పూజ'),
            jsonb_build_object(
                'en', 'Invocation and worship of Lord Vigneshwara with turmeric Ganapathi to remove all obstacles before the main rituals.',
                'te', 'విఘ్నాలు తొలగి కార్యసిద్ధి కలగాలని పసుపు గణపతిని ప్రతిష్టించి పూజించడం.'
            ),
            15,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 3: Kalasa Pooja and Varuna Avahana
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            3,
            jsonb_build_object('en', 'Kalasa Pooja and Varuna Avahana', 'te', 'కలశ పూజ మరియు వరుణ ఆవాహన'),
            jsonb_build_object(
                'en', 'Consecration of the sacred Kalasam with water, mango leaves, and coconut, invoking Lord Varuna and the sacred rivers.',
                'te', 'కలశంలో పవిత్ర జలములు, మామిడి ఆకులు, కొబ్బరికాయను ఉంచి వరుణ దేవుని మరియు పుణ్య నదులను ఆవాహన చేసి పూజించడం.'
            ),
            15,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 4: Satyanarayana Swamy Avahana and Shodasopachara Pooja
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            4,
            jsonb_build_object('en', 'Satyanarayana Swamy Avahana and Shodasopachara Pooja', 'te', 'సత్యనారాయణ స్వామి ఆవాహన మరియు షోడశోపచార పూజ'),
            jsonb_build_object(
                'en', 'Invocation of Lord Sri Satyanarayana Swamy onto the mandapam followed by the sixteen traditional ritual offerings (Shodasopacharas), tulasi archana, and astothara shatanama pooja.',
                'te', 'శ్రీ సత్యనారాయణ స్వామిని ఆవాహన చేసి షోడశోపచార పూజ, తులసీ దళాలతో అష్టోత్తర శతనామార్చన సమర్పించడం.'
            ),
            30,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 5: Satyanarayana Vratha Katha
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            5,
            jsonb_build_object('en', 'Satyanarayana Vratha Katha', 'te', 'సత్యనారాయణ వ్రత కథా శ్రవణం'),
            jsonb_build_object(
                'en', 'Recitation and listening to the sacred five chapters of Sri Satyanarayana Vratha Katha from the Skanda Purana with full devotion and attention.',
                'te', 'స్కాంద పురాణోక్త శ్రీ సత్యనారాయణ స్వామి మహిమను వివరించే ఐదు అధ్యాయాల వ్రత కథలను భక్తిశ్రద్ధలతో పఠించడం మరియు వినడం.'
            ),
            30,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 6: Prasadam, Naivedyam and Harathi
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            6,
            jsonb_build_object('en', 'Prasadam, Naivedyam and Harathi', 'te', 'ప్రసాదం, నైవేద్యం మరియు హారతి'),
            jsonb_build_object(
                'en', 'Offering of special Sapatha prasadam (wheat rava, milk, ghee, sugar, bananas), panchamrutham, followed by Karpura Harathi and Pushpanjali.',
                'te', 'గోధుమ రవ్వ, పాలు, నెయ్యి, పంచదార, అరటిపండ్లతో చేసిన సపాథ ప్రసాదం మరియు పంచామృతాలు నైవేద్యంగా సమర్పించి కర్పూర హారతి ఇవ్వడం.'
            ),
            15,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Step 7: Dakshina and Ashirvachanam
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES (
            v_version_id,
            7,
            jsonb_build_object('en', 'Dakshina and Ashirvachanam', 'te', 'దక్షిణ మరియు ఆశీర్వచనం'),
            jsonb_build_object(
                'en', 'Offering Tamboolam and Dakshina to the Purohits followed by receiving divine Vedic blessings (Ashirvachanam) and distribution of Teertha Prasadam to all devotees.',
                'te', 'పురోహితులకు తాంబూల దక్షిణలు సమర్పించి వేద ఆశీర్వచనాలు తీసుకోవడం మరియు భక్తులకు తీర్థ ప్రసాదాలు పంపిణీ చేయడం.'
            ),
            10,
            'purohit',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;


        -- --------------------------------------------------------------------
        -- C. 5 KATHA CHAPTERS (ps.vidhi_katha_chapter)
        -- --------------------------------------------------------------------
        -- Chapter 1: The Poor Brahmin
        INSERT INTO ps.vidhi_katha_chapter (vidhi_version_id, chapter_no, title, summary, content, source_reference, is_published)
        VALUES (
            v_version_id,
            1,
            jsonb_build_object('en', 'The Poor Brahmin', 'te', 'పేద బ్రాహ్మణుని కథ'),
            jsonb_build_object(
                'en', 'A poor Brahmin in Kashi is instructed by the Lord to perform the Vratam and subsequently experiences prosperity.',
                'te', 'కాశీ నగరంలో నివసించే ఒక నిరుపేద బ్రాహ్మణునికి శ్రీమహావిష్ణువు వృద్ధ బ్రాహ్మణ రూపంలో దర్శనమిచ్చి, సత్యనారాయణ వ్రత మహిమను తెలిపి దానిని ఆచరించమని ఉపదేశిస్తాడు. ఆ బ్రాహ్మణుడు భక్తితో వ్రతం ఆచరించి దారిద్ర్యం నుండి విముక్తుడై సకల సంపదలను పొందుతాడు.'
            ),
            NULL,
            'Skanda Purana, Reva Khanda',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, chapter_no) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content, is_published = EXCLUDED.is_published;

        -- Chapter 2: The Woodcutter
        INSERT INTO ps.vidhi_katha_chapter (vidhi_version_id, chapter_no, title, summary, content, source_reference, is_published)
        VALUES (
            v_version_id,
            2,
            jsonb_build_object('en', 'The Woodcutter', 'te', 'కట్టెలమ్మే వ్యక్తి కథ'),
            jsonb_build_object(
                'en', 'A woodcutter performs the Vratam and receives the Lord''s blessings and prosperity.',
                'te', 'ఒక నిరుపేద కట్టెల వ్యాపారి ఆ బ్రాహ్మణుని గృహంలో జరుగుతున్న సత్యనారాయణ వ్రతాన్ని దర్శించి, ప్రసాదం స్వీకరించి స్వామి మహిమను తెలుసుకుంటాడు. తాను కూడా కట్టెలు అమ్మి వచ్చిన ధనంతో వ్రతం ఆచరిస్తానని సంకల్పించి, అనుకున్నట్లే రెట్టింపు ధనం రావడంతో వ్రతం చేసి స్వామి అనుగ్రహంతో సుఖసంతోషాలను పొందుతాడు.'
            ),
            NULL,
            'Skanda Purana, Reva Khanda',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, chapter_no) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content, is_published = EXCLUDED.is_published;

        -- Chapter 3: King Ulkamukha
        INSERT INTO ps.vidhi_katha_chapter (vidhi_version_id, chapter_no, title, summary, content, source_reference, is_published)
        VALUES (
            v_version_id,
            3,
            jsonb_build_object('en', 'King Ulkamukha', 'te', 'ఉల్కాముఖ మహారాజు కథ'),
            jsonb_build_object(
                'en', 'The king neglects the prasadam, experiences misfortune, and later regains his well-being after performing the Vratam again.',
                'te', 'ఉల్కాముఖ మహారాజు తన భార్యతో కలిసి భద్రశిలా నదీ తీరంలో సత్యనారాయణ వ్రతం చేస్తుండగా, సాధువు అనే వైశ్య వర్తకుడు వచ్చి చూసి తాను సంతానం కలిగితే వ్రతం చేస్తానని మొక్కుకుంటాడు. సంతానం కలిగిన తర్వాత వ్రతం చేయకపోవడంతో పాటు ప్రసాదం పట్ల అశ్రద్ధ చూపడం వలన కష్టాలు అనుభవించి, తిరిగి వ్రతాన్ని ఆచరించి పూర్వ వైభవాన్ని పొందుతాడు.'
            ),
            NULL,
            'Skanda Purana, Reva Khanda',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, chapter_no) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content, is_published = EXCLUDED.is_published;

        -- Chapter 4: Merchant Sadhuvu and Kalavati
        INSERT INTO ps.vidhi_katha_chapter (vidhi_version_id, chapter_no, title, summary, content, source_reference, is_published)
        VALUES (
            v_version_id,
            4,
            jsonb_build_object('en', 'Merchant Sadhuvu and Kalavati', 'te', 'సాధు వర్తకుడు మరియు కళావతి కథ'),
            jsonb_build_object(
                'en', 'The merchant forgets his promise to perform the Vratam. His family faces difficulties, and his daughter''s observance of the Vratam brings relief.',
                'te', 'సాధు వర్తకుడు కుమార్తె కళావతి వివాహం జరిగిన తర్వాత కూడా మొక్కు మరచిపోవడంతో స్వామి ఆగ్రహానికి గురై రత్నసారపురంలో అల్లుడితో సహా దొంగతనం మోపబడి కారాగార పాలవుతాడు. ఇక్కడ స్వగృహంలో దారిద్ర్యం తాండవించగా, కళావతి ఒక బ్రాహ్మణుని ఇంట్లో సత్యనారాయణ వ్రతం దర్శించి స్వయంగా పూజ చేస్తుంది. దీనితో స్వామి కటాక్షించి వర్తకులను కారాగార విముక్తులను చేసి, ధనధాన్యాలతో స్వదేశానికి చేరుస్తాడు.'
            ),
            NULL,
            'Skanda Purana, Reva Khanda',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, chapter_no) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content, is_published = EXCLUDED.is_published;

        -- Chapter 5: King Tungadhwaja
        INSERT INTO ps.vidhi_katha_chapter (vidhi_version_id, chapter_no, title, summary, content, source_reference, is_published)
        VALUES (
            v_version_id,
            5,
            jsonb_build_object('en', 'King Tungadhwaja', 'te', 'తుంగధ్వజ మహారాజు కథ'),
            jsonb_build_object(
                'en', 'The king disrespects the prasadam, suffers losses, and later repents and receives the Lord''s blessings.',
                'te', 'తుంగధ్వజ మహారాజు వేటకు వెళ్లి అడవిలో గొల్లపిల్లలు (గోపాలురు) భక్తితో చేస్తున్న సత్యనారాయణ పూజను చూసి కూడా అహంకారంతో ప్రసాదాన్ని తిరస్కరిస్తాడు. ఆ అపచారం వలన అతని రాజ్యం, సంపద మరియు నూరుగురు కుమారులు నశిస్తారు. తప్పు తెలుసుకున్న రాజు పశ్చాత్తాపంతో గోపాలురతో కలిసి స్వయంగా సత్యనారాయణ వ్రతం ఆచరించి, ప్రసాదాన్ని భక్తితో స్వీకరించి స్వామి అనుగ్రహంతో కోల్పోయిన వైభవాన్ని, పుత్రులను తిరిగి పొందుతాడు.'
            ),
            NULL,
            'Skanda Purana, Reva Khanda',
            FALSE
        )
        ON CONFLICT (vidhi_version_id, chapter_no) DO UPDATE
        SET title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content, is_published = EXCLUDED.is_published;


        -- --------------------------------------------------------------------
        -- D. QUANTITY-FREE SAMAGRI CHECKLIST (ps.vidhi_samagri_checklist)
        -- --------------------------------------------------------------------
        -- 1. POOJA ITEMS (20 items)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, samagri_item_id, item_name, sort_order)
        VALUES
            (v_version_id, 'pooja_items', v_item_photo, jsonb_build_object('en', 'Lord Satyanarayana Swamy photo or idol', 'te', 'శ్రీ సత్యనారాయణ స్వామి పటం లేదా విగ్రహం'), 1),
            (v_version_id, 'pooja_items', v_item_kalasham, jsonb_build_object('en', 'Kalasam (steel or copper)', 'te', 'కలశం (రాగి లేదా స్టీల్)'), 2),
            (v_version_id, 'pooja_items', v_item_coconut, jsonb_build_object('en', 'Coconut for Kalasam', 'te', 'కలశం కొబ్బరికాయ'), 3),
            (v_version_id, 'pooja_items', v_item_turmeric, jsonb_build_object('en', 'Turmeric (Pasupu)', 'te', 'పసుపు'), 4),
            (v_version_id, 'pooja_items', v_item_kumkum, jsonb_build_object('en', 'Kumkum', 'te', 'కుంకుమ'), 5),
            (v_version_id, 'pooja_items', v_item_sandal, jsonb_build_object('en', 'Sandalwood powder', 'te', 'గంధం పొడి'), 6),
            (v_version_id, 'pooja_items', v_item_betel, jsonb_build_object('en', 'Betel leaves (Tamalapaku)', 'te', 'తమలపాకులు'), 7),
            (v_version_id, 'pooja_items', v_item_betelnut, jsonb_build_object('en', 'Betel nuts (Vakkalu)', 'te', 'వక్కలు'), 8),
            (v_version_id, 'pooja_items', v_item_garland, jsonb_build_object('en', 'Flower garlands', 'te', 'పూల దండలు'), 9),
            (v_version_id, 'pooja_items', v_item_flowers, jsonb_build_object('en', 'Loose flowers', 'te', 'పూలు'), 10),
            (v_version_id, 'pooja_items', v_item_tulasi, jsonb_build_object('en', 'Tulasi leaves', 'te', 'తులసి దళాలు'), 11),
            (v_version_id, 'pooja_items', v_item_banana, jsonb_build_object('en', 'Bananas', 'te', 'అరటిపండ్లు'), 12),
            (v_version_id, 'pooja_items', v_item_apple, jsonb_build_object('en', 'Apples', 'te', 'ఆపిల్ పండ్లు'), 13),
            (v_version_id, 'pooja_items', v_item_coconut, jsonb_build_object('en', 'Coconuts for breaking', 'te', 'కొట్టడానికి కొబ్బరికాయలు'), 14),
            (v_version_id, 'pooja_items', v_item_rice, jsonb_build_object('en', 'Rice for Akshatalu', 'te', 'అక్షతల బియ్యం'), 15),
            (v_version_id, 'pooja_items', v_item_turmeric, jsonb_build_object('en', 'Turmeric for Akshatalu', 'te', 'అక్షతల పసుపు'), 16),
            (v_version_id, 'pooja_items', v_item_thoram, jsonb_build_object('en', 'Satyanarayana Thoranam thread', 'te', 'సత్యనారాయణ నోము దారము (తోరం)'), 17),
            (v_version_id, 'pooja_items', v_item_agarbatti, jsonb_build_object('en', 'Incense sticks', 'te', 'అగరబత్తులు'), 18),
            (v_version_id, 'pooja_items', v_item_camphor, jsonb_build_object('en', 'Camphor', 'te', 'కర్పూరం'), 19),
            (v_version_id, 'pooja_items', v_item_lampoil, jsonb_build_object('en', 'Deepam oil and wicks', 'te', 'దీపారాధన నూనె మరియు వత్తులు'), 20)
        ON CONFLICT (vidhi_version_id, checklist_group, sort_order) DO UPDATE
        SET item_name = EXCLUDED.item_name, samagri_item_id = EXCLUDED.samagri_item_id;

        -- 2. PRASADAM INGREDIENTS (8 items)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, samagri_item_id, item_name, sort_order)
        VALUES
            (v_version_id, 'prasadam_ingredients', v_item_wheatrava, jsonb_build_object('en', 'Wheat rava', 'te', 'గోధుమ రవ్వ'), 1),
            (v_version_id, 'prasadam_ingredients', v_item_sugar, jsonb_build_object('en', 'Sugar', 'te', 'పంచదార'), 2),
            (v_version_id, 'prasadam_ingredients', v_item_banana, jsonb_build_object('en', 'Bananas', 'te', 'అరటిపండ్లు'), 3),
            (v_version_id, 'prasadam_ingredients', v_item_milk, jsonb_build_object('en', 'Milk', 'te', 'పాలు'), 4),
            (v_version_id, 'prasadam_ingredients', v_item_ghee, jsonb_build_object('en', 'Ghee', 'te', 'ఆవు నెయ్యి'), 5),
            (v_version_id, 'prasadam_ingredients', v_item_cardamom, jsonb_build_object('en', 'Cardamom', 'te', 'యాలకులు'), 6),
            (v_version_id, 'prasadam_ingredients', v_item_cashew, jsonb_build_object('en', 'Cashews', 'te', 'జీడిపప్పు'), 7),
            (v_version_id, 'prasadam_ingredients', v_item_raisin, jsonb_build_object('en', 'Raisins', 'te', 'కిస్‌మిస్'), 8)
        ON CONFLICT (vidhi_version_id, checklist_group, sort_order) DO UPDATE
        SET item_name = EXCLUDED.item_name, samagri_item_id = EXCLUDED.samagri_item_id;

        -- 3. PANCHAMRUTHAM INGREDIENTS (5 items)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, samagri_item_id, item_name, sort_order)
        VALUES
            (v_version_id, 'panchamrutham_ingredients', v_item_milk, jsonb_build_object('en', 'Milk', 'te', 'ఆవు పాలు'), 1),
            (v_version_id, 'panchamrutham_ingredients', v_item_curd, jsonb_build_object('en', 'Curd', 'te', 'పెరుగు'), 2),
            (v_version_id, 'panchamrutham_ingredients', v_item_ghee, jsonb_build_object('en', 'Ghee', 'te', 'ఆవు నెయ్యి'), 3),
            (v_version_id, 'panchamrutham_ingredients', v_item_honey, jsonb_build_object('en', 'Honey', 'te', 'తేనె'), 4),
            (v_version_id, 'panchamrutham_ingredients', v_item_sugar, jsonb_build_object('en', 'Sugar', 'te', 'పంచదార'), 5)
        ON CONFLICT (vidhi_version_id, checklist_group, sort_order) DO UPDATE
        SET item_name = EXCLUDED.item_name, samagri_item_id = EXCLUDED.samagri_item_id;

        -- 4. ITEMS FOR KATHA AND SANKALPAM (5 items)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, samagri_item_id, item_name, sort_order, is_optional)
        VALUES
            (v_version_id, 'katha_sankalpam_items', v_item_coins, jsonb_build_object('en', 'Rupee coins', 'te', 'రూపాయి నాణాలు'), 1, FALSE),
            (v_version_id, 'katha_sankalpam_items', v_item_rice, jsonb_build_object('en', 'Small bowl of rice', 'te', 'చిన్న గిన్నెడు బియ్యం'), 2, FALSE),
            (v_version_id, 'katha_sankalpam_items', NULL, jsonb_build_object('en', 'Seating arrangements for the Purohit and family', 'te', 'పురోహితులు మరియు కుటుంబానికి ఆసనాలు (పీటలు/చాపలు)'), 3, FALSE),
            (v_version_id, 'katha_sankalpam_items', v_item_deitycloth, jsonb_build_object('en', 'New clothes for the deity (optional)', 'te', 'స్వామివారికి నూతన వస్త్రాలు (ఐచ్ఛికం)'), 4, TRUE),
            (v_version_id, 'katha_sankalpam_items', v_item_plantainleaf, jsonb_build_object('en', 'Banana leaves or plates for prasadam', 'te', 'ప్రసాదం పంపిణీకి అరిటాకులు లేదా విస్తళ్ళు'), 5, FALSE)
        ON CONFLICT (vidhi_version_id, checklist_group, sort_order) DO UPDATE
        SET item_name = EXCLUDED.item_name, samagri_item_id = EXCLUDED.samagri_item_id, is_optional = EXCLUDED.is_optional;


        -- --------------------------------------------------------------------
        -- E. CUSTOMER PREPARATION TASKS (ps.vidhi_family_task)
        -- --------------------------------------------------------------------
        DELETE FROM ps.vidhi_family_task WHERE vidhi_version_id = v_version_id;

        INSERT INTO ps.vidhi_family_task (vidhi_version_id, sort_order, task, due_before_hours)
        VALUES
            (
                v_version_id,
                1,
                jsonb_build_object('en', 'Clean pooja area (about 6 × 6 ft, preferably facing east or north)', 'te', 'శుభ్రపరిచిన పూజా స్థలం (సుమారు 6 × 6 అడుగులు, తూర్పు లేదా ఉత్తర ముఖంగా)'),
                2
            ),
            (
                v_version_id,
                2,
                jsonb_build_object('en', 'Small table or chowki with a clean or new cloth for deity mandapam', 'te', 'పూజా పీఠం లేదా చిన్న బల్లపై శుభ్రమైన నూతన వస్త్రం అమర్చడం'),
                2
            ),
            (
                v_version_id,
                3,
                jsonb_build_object('en', 'Fresh drinking water in a clean vessel and glass', 'te', 'పూజ మరియు ప్రసాదం కొరకు శుభ్రమైన త్రాగునీరు'),
                1
            ),
            (
                v_version_id,
                4,
                jsonb_build_object('en', 'Matchbox for lighting deepam and harathi', 'te', 'దీపారాధన మరియు హారతి కొరకు అగ్గిపెట్టె'),
                1
            ),
            (
                v_version_id,
                5,
                jsonb_build_object('en', 'All family members should take bath and be ready in traditional attire before the pooja begins', 'te', 'పూజ ప్రారంభానికి ముందే కుటుంబ సభ్యులందరూ సంప్రదాయ వస్త్రధారణతో సిద్ధంగా ఉండాలి'),
                1
            );


        -- --------------------------------------------------------------------
        -- F. CUSTOMER INSTRUCTIONS & FAQS (ps.vidhi_faq)
        -- --------------------------------------------------------------------
        DELETE FROM ps.vidhi_faq WHERE vidhi_version_id = v_version_id;

        INSERT INTO ps.vidhi_faq (vidhi_version_id, sort_order, question, answer)
        VALUES
            (
                v_version_id,
                1,
                jsonb_build_object(
                    'en', 'When is the best time to perform Satyanarayana Vratam?',
                    'te', 'సత్యనారాయణ వ్రతాన్ని ఆచరించడానికి ఏ సమయం శ్రేయస్కరం?'
                ),
                jsonb_build_object(
                    'en', 'Pournami, Ekadasi, or another auspicious day may be selected according to family tradition and the Purohit''s guidance. Morning is preferred in this guide.',
                    'te', 'కుటుంబ సంప్రదాయం మరియు పురోహితుల మార్గదర్శకత్వం ప్రకారం పౌర్ణమి, ఏకాదశి లేదా ఇతర శుభ దినాన్ని ఎంచుకోవచ్చు. ఈ మార్గదర్శి ప్రకారం ఉదయ సమయం అత్యంత శ్రేయస్కరం.'
                )
            ),
            (
                v_version_id,
                2,
                jsonb_build_object(
                    'en', 'What preparations should the family observe on the pooja day?',
                    'te', 'పూజా దినాన కుటుంబ సభ్యులు పాటించవలసిన నియమాలు ఏమిటి?'
                ),
                jsonb_build_object(
                    'en', 'Family members should be ready in traditional attire before the pooja begins. Follow the Purohit''s instructions regarding fasting and food.',
                    'te', 'పూజ ప్రారంభానికి ముందే కుటుంబ సభ్యులందరూ సంప్రదాయ వస్త్రధారణతో సిద్ధంగా ఉండాలి. ఉపవాసం మరియు ఆహార నియమాల విషయంలో పురోహితుల ఆదేశాలను పాటించాలి.'
                )
            ),
            (
                v_version_id,
                3,
                jsonb_build_object(
                    'en', 'Is it required to listen to the complete Vratha Katha?',
                    'te', 'సంపూర్ణ వ్రత కథను వినడం తప్పనిసరియా?'
                ),
                jsonb_build_object(
                    'en', 'Yes, devotees should listen to the complete Vratha Katha (all 5 chapters) without interruption with complete devotion to receive the Lord''s full grace.',
                    'te', 'అవును, భక్తులు ఐదు అధ్యాయాల సంపూర్ణ వ్రత కథను మధ్యలో ఎటువంటి ఆటంకం లేకుండా భక్తిశ్రద్ధలతో ఏకాగ్రతతో వినాలి.'
                )
            ),
            (
                v_version_id,
                4,
                jsonb_build_object(
                    'en', 'Do ritual procedures and samagri requirements vary by family or tradition?',
                    'te', 'సంప్రదాయాలను బట్టి పూజా విధానాలు మరియు సామాగ్రి మారుతుంటాయా?'
                ),
                jsonb_build_object(
                    'en', 'Yes, ritual procedures and samagri requirements may vary slightly according to Sampradayam and family tradition. Consult your assigned Purohit for specific family customs.',
                    'te', 'అవును, సంప్రదాయం మరియు కుటుంబ ఆచారాల ప్రకారం పూజా విధానాలు మరియు సామాగ్రి అవసరాలలో స్వల్ప మార్పులు ఉండవచ్చు. కుటుంబ ఆచారాలకు సంబంధించి మీ పురోహితులను సంప్రదించండి.'
                )
            );

        -- --------------------------------------------------------------------
        -- G. PUBLISH VERSION 2 (Transitions from 'draft' to 'published')
        -- (Now all requirements of vidhi_publish_guard are met!)
        -- --------------------------------------------------------------------
        UPDATE ps.vidhi_version
        SET
            title = jsonb_build_object(
                'en', 'Satyanarayana Vratam · ' || v_target_vidhis.sampradayam_name || ' Vidhi',
                'te', 'శ్రీ సత్యనారాయణ వ్రతం · ' || CASE
                    WHEN v_target_vidhis.sampradayam_code = 'smartha' THEN 'స్మార్త'
                    WHEN v_target_vidhis.sampradayam_code = 'madhva' THEN 'మాధ్వ'
                    WHEN v_target_vidhis.sampradayam_code = 'srivaishnava' THEN 'శ్రీవైష్ణవ'
                    ELSE 'సామాన్య'
                END || ' విధి'
            ),
            summary = jsonb_build_object(
                'en', 'Complete Satyanarayana Vratam with Kalasa Pooja, Shodasopachara Pooja, five chapters of the Vratha Katha, prasadam offering, and Harathi.',
                'te', 'కలశ పూజ, షోడశోపచార పూజ, ఐదు అధ్యాయాల వ్రత కథ, ప్రసాదం సమర్పణ మరియు హారతితో కూడిన సంపూర్ణ సత్యనారాయణ వ్రతం.'
            ),
            source_text = 'Skanda Purana, Reva Khanda (' || v_target_vidhis.sampradayam_name || ')',
            duration_minutes = 120,
            min_purohits = 1,
            dakshina_min = 2600.00,
            dakshina_max = 3900.00,
            needs_homa_kundam = FALSE,
            status = 'published'::ps.vidhi_status,
            approved_by = v_approver_id,
            approved_at = NOW(),
            effective_from = NOW()
        WHERE id = v_version_id;

        -- Set pooja_vidhi.current_version_id to point to version 2
        UPDATE ps.pooja_vidhi
        SET current_version_id = v_version_id, updated_at = NOW()
        WHERE id = v_target_vidhis.pooja_vidhi_id;

    END LOOP;
END $$;

COMMIT;
