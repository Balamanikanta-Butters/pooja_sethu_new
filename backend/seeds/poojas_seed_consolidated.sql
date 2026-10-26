-- ============================================================================
-- POOJA SETHU CONSOLIDATED SEED FILE
-- Contains comprehensive catalogue, vidhi steps, checklist, samagri, and FAQs
-- for all Pooja Sethu services.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. GRUHAPRAVESAM (House Warming Pooja)
-- ============================================================================
DO $$
DECLARE
    v_pooja_id UUID := 'ff33f14c-2cbd-48a4-b620-933afd600aad';
    v_category_id UUID;
    v_vidhi_rec RECORD;
    v_version_id UUID;
BEGIN
    -- Verify / Get category for Gruha Pooja
    SELECT id INTO v_category_id FROM ps.pooja_category WHERE code = 'gruha' OR code = 'gruha_pooja' LIMIT 1;
    IF v_category_id IS NULL THEN
        SELECT id INTO v_category_id FROM ps.pooja_category LIMIT 1;
    END IF;

    -- Update ps.pooja catalogue entry
    UPDATE ps.pooja
    SET
        name = jsonb_build_object(
            'en', 'Gruhapravesam',
            'te', 'గృహప్రవేశం'
        ),
        significance = jsonb_build_object(
            'en', 'Traditional housewarming ceremony performed to seek blessings for the new home, purification, prosperity, and well-being of the family with Vastu Pooja, Kalasa Sthapana, Navagraha Pooja, and Milk Boiling.',
            'te', 'నూతన గృహ శుద్ధి, సుఖశాంతులు, వాస్తు పూజ, కలశ స్థాపన, నవగ్రహ పూజ మరియు పాలు పొంగించే సాంప్రదాయ గృహప్రవేశ మహోత్సవం.',
            'region', 'Telugu States / All Regions',
            'duration', 'Approximately 2.5–3.5 hours',
            'occasions', jsonb_build_array('New House', 'Renovated House', 'Rented House Pravesham')
        ),
        is_muhurtham_required = TRUE,
        status = 'active'::ps.record_status
    WHERE id = v_pooja_id;

    -- Iterate over each sampradayam vidhi for Gruhapravesam
    FOR v_vidhi_rec IN
        SELECT pv.id as vidhi_id, pv.current_version_id, s.code as sampradayam_code, s.name->>'en' as sampradayam_name
        FROM ps.pooja_vidhi pv
        JOIN ps.sampradayam s ON pv.sampradayam_id = s.id
        WHERE pv.pooja_id = v_pooja_id
    LOOP
        v_version_id := v_vidhi_rec.current_version_id;

        -- Temporarily set to 'draft' to allow modifications of child elements
        UPDATE ps.vidhi_version
        SET status = 'draft'::ps.vidhi_status
        WHERE id = v_version_id;

        -- --------------------------------------------------------------------
        -- 1.1 RITUAL STEPS (8 Ordered Steps with Upsert)
        -- --------------------------------------------------------------------
        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 1,
            jsonb_build_object('en', 'Vastu Pooja at Main Entrance', 'te', 'సింహద్వార వాస్తు పూజ'),
            jsonb_build_object('en', 'Entrance rituals, breaking of coconut, Rangoli with Pasupu-Kumkum on door frame, and worshipping Vastu Purusha with Akshatalu and flowers.', 'te', 'సింహద్వారం వద్ద పూజ, కొబ్బరికాయ కొట్టడం, గడపకు పసుపు-కుంకుమ, ముగ్గులు వేసి అక్షతలు, పుష్పాలతో వాస్తు పురుష ప్రార్థన.'),
            20, 'both', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 2,
            jsonb_build_object('en', 'Go-Pooja / Gau Pravesham (Optional)', 'te', 'గోపూజ / గో ప్రవేశం'),
            jsonb_build_object('en', 'Traditional worship of sacred cow and calf (or idol), offering jaggery, bananas, and receiving Gomata blessings before entry.', 'te', 'గోమాతకు పూజ, బెల్లం మరియు అరటిపండ్లు సమర్పించి ఆశీస్సులు పొందడం (ఆవు లేనిచో గోమాత ప్రతిమ పూజ).'),
            15, 'karta', TRUE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 3,
            jsonb_build_object('en', 'Ganapathi Pooja & Kalasa Pooja', 'te', 'గణపతి పూజ మరియు కలశ పూజ'),
            jsonb_build_object('en', 'Invocation of Lord Vighneshwara with Vakratunda Mahakaya prayer. Kalasa Sthapana with sacred water, mango leaves, and coconut invoking Varuna and Vastu Devathas.', 'te', 'విఘ్నేశ్వర ప్రార్థన, కలశ స్థాపన, మామిడి ఆకులు, కొబ్బరికాయతో వరుణ మరియు వాస్తు దేవతల ఆవాహన.'),
            25, 'purohit', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 4,
            jsonb_build_object('en', 'Navagraha Pooja & Punyaha Vachanam', 'te', 'నవగ్రహ పూజ మరియు పుణ్యాహవాచనం'),
            jsonb_build_object('en', 'Navagraha Devata worship for peace and prosperity. Punyaha Vachanam ritual purification and sprinkling holy water across the home.', 'te', 'గృహ శాంతి కోసం నవగ్రహాల ఆరాధన, గృహ పవిత్రత కోసం పుణ్యాహవాచనం చేసి పవిత్ర జలాలను ఇల్లంతా ప్రోక్షించడం.'),
            25, 'purohit', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 5,
            jsonb_build_object('en', 'Vastu Homam / Ganapathi Homam', 'te', 'వాస్తు హోమం / గణపతి హోమం'),
            jsonb_build_object('en', 'Agni Prathishtapana in the Homa Kundam with sacred samidhalu, ghee, and navadhanya offerings for positive energy and vastu dosha nivarana.', 'te', 'హోమ కుండంలో అగ్ని ప్రతిష్టాపన, సమిధలు, నెయ్యి, నవధాన్యాల సమర్పణతో వాస్తు దోష నివారణ హోమం.'),
            35, 'both', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 6,
            jsonb_build_object('en', 'Milk Boiling & Pongal Ritual', 'te', 'పాలు పొంగించడం మరియు పొంగలి సమర్పణ'),
            jsonb_build_object('en', 'Auspicious boiling of fresh milk in a new vessel until it overflows representing overflowing abundance. Sweet Pongal preparation and Naivedyam.', 'te', 'కొత్త పాత్రలో ఆవు పాలు పొంగించడం, మధురమైన పరమాన్నం / పొంగలి తయారు చేసి స్వామివారికి నైవేద్యం పెట్టడం.'),
            20, 'karta', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 7,
            jsonb_build_object('en', 'Satyanarayana Vratam (If Included)', 'te', 'సత్యనారాయణ వ్రతం (చేర్చుకున్నచో)'),
            jsonb_build_object('en', 'Recitation of Sri Satyanarayana Vratha Katha, Maha Mangala Harathi, and offering of divine Panchamrutham and Rava Prasadam.', 'te', 'శ్రీ సత్యనారాయణ స్వామి వ్రత కథా శ్రవణం, పంచామృతం, రవ్వ ప్రసాదం మరియు మహా మంగళ హారతి.'),
            30, 'both', TRUE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        INSERT INTO ps.vidhi_step (vidhi_version_id, step_no, name, description, duration_minutes, performed_by, is_optional)
        VALUES
        (
            v_version_id, 8,
            jsonb_build_object('en', 'Completion, Ashirvachanam & Prasadam', 'te', 'పూర్ణాహుతి, ఆశీర్వచనం & ప్రసాదం'),
            jsonb_build_object('en', 'Concluding Vedic Ashirvachanam from certified Purohits, offering Dakshina with Tambulam, and distributing Teertha Prasadam to family and guests.', 'te', 'వేద పండితుల ఆశీర్వచనం, తాంబూల దక్షిణ సమర్పణ, కుటుంబసభ్యులు మరియు బంధువులకు తీర్థప్రసాద వితరణ.'),
            15, 'purohit', FALSE
        )
        ON CONFLICT (vidhi_version_id, step_no) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, performed_by = EXCLUDED.performed_by;

        -- Unlink any food rules from steps before deleting steps > 8
        UPDATE ps.vidhi_food_rule
        SET vidhi_step_id = NULL
        WHERE vidhi_step_id IN (
            SELECT id FROM ps.vidhi_step WHERE vidhi_version_id = v_version_id
        );

        -- Remove any steps > 8 from old initial seeds
        DELETE FROM ps.vidhi_step WHERE vidhi_version_id = v_version_id AND step_no > 8;

        -- --------------------------------------------------------------------
        -- 1.2 CUSTOMER QUANTITY-FREE PREPARATION CHECKLIST (33 Items across 4 Groups)
        -- --------------------------------------------------------------------
        DELETE FROM ps.vidhi_samagri_checklist WHERE vidhi_version_id = v_version_id;

        -- Group 1: pooja_items (General Setup & Vastu Entrance)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, item_name, sort_order, is_optional)
        VALUES
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Clean house and pooja altar area', 'te', 'శుభ్రం చేసిన ఇల్లు మరియు పూజా మందిరం'), 1, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Main entrance cleaned and decorated for Vastu Pooja', 'te', 'సింహద్వారం అలంకరణ మరియు వాస్తు స్థలం'), 2, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Rangoli powders and chalk (Muggu)', 'te', 'ముగ్గు పిండి మరియు రంగులు'), 3, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Clean peetam / wooden chowki for idols', 'te', 'పూజా పీఠం / చెక్క బల్ల'), 4, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Small Ganesh idol / photo', 'te', 'చిన్న గణపతి ప్రతిమ లేదా పటం'), 5, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Kalasam vessel (copper / brass / silver)', 'te', 'కలశ పాత్ర (రాగి లేదా ఇత్తడి)'), 6, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Coconut with stalk for Kalasam', 'te', 'పీచు ఉన్న కలశం కొబ్బరికాయ'), 7, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Fresh mango leaves (Mavillaku)', 'te', 'తాజా మామిడి ఆకులు'), 8, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Deepam oil, wicks, and lamps (Kundulu)', 'te', 'దీపపు నూనె, వత్తులు, ప్రమిదలు'), 9, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Matchbox, camphor, and agarbatti', 'te', 'అగ్గిపెట్టె, కర్పూరం, అగరుబత్తులు'), 10, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Drinking water and clean vessels for pooja', 'te', 'మంచినీరు మరియు పూజా పాత్రలు'), 11, FALSE),
        (v_version_id, 'pooja_items', jsonb_build_object('en', 'Cow & calf idol (Gau Pratima) for Go-Pooja', 'te', 'గోమాత ప్రతిమ లేదా చిత్రం'), 12, TRUE);

        -- Group 2: prasadam_ingredients (Milk Boiling & Pongal Ritual)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, item_name, sort_order, is_optional)
        VALUES
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'New vessel / brass pot for boiling milk', 'te', 'పాలు పొంగించడానికి కొత్త పాత్ర / గిన్నె'), 1, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Stove or gas arrangement in the kitchen', 'te', 'పాలు కాచడానికి పొయ్యి / గ్యాస్ స్టవ్ ఏర్పాట్లు'), 2, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Fresh raw cow milk (1–2 liters)', 'te', 'తాజా ఆవు పాలు (1-2 లీటర్లు)'), 3, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Raw rice for Pongal', 'te', 'పొంగలికి కొత్త బియ్యం'), 4, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Organic jaggery (Bellam)', 'te', 'బెల్లం'), 5, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Pure cow ghee for sweet preparation', 'te', 'స్వచ్ఛమైన ఆవు నెయ్యి'), 6, FALSE),
        (v_version_id, 'prasadam_ingredients', jsonb_build_object('en', 'Cardamom and cashews for Pongal', 'te', 'యాలకులు మరియు జీడిపప్పు'), 7, TRUE);

        -- Group 3: panchamrutham_ingredients
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, item_name, sort_order, is_optional)
        VALUES
        (v_version_id, 'panchamrutham_ingredients', jsonb_build_object('en', 'Fresh cow milk (Aavu Paalu)', 'te', 'ఆవు పాలు'), 1, FALSE),
        (v_version_id, 'panchamrutham_ingredients', jsonb_build_object('en', 'Fresh curd (Perugu)', 'te', 'తాజా పెరుగు'), 2, FALSE),
        (v_version_id, 'panchamrutham_ingredients', jsonb_build_object('en', 'Pure cow ghee (Aavu Neyyi)', 'te', 'ఆవు నెయ్యి'), 3, FALSE),
        (v_version_id, 'panchamrutham_ingredients', jsonb_build_object('en', 'Pure wild honey (Thene)', 'te', 'స్వచ్ఛమైన తేనె'), 4, FALSE),
        (v_version_id, 'panchamrutham_ingredients', jsonb_build_object('en', 'Sugar / Sugar candy (Panchadara)', 'te', 'పంచదార / కలకండ'), 5, FALSE);

        -- Group 4: katha_sankalpam_items (Homam, Vastu, & Vratam Items)
        INSERT INTO ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group, item_name, sort_order, is_optional)
        VALUES
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Homa Kundam (iron / copper) or bricks with sand', 'te', 'హోమ కుండం లేదా ఇటుకలు, ఇసుక'), 1, TRUE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Samidhalu (sacred dry wood sticks) & dry cow dung', 'te', 'హోమ సమిధలు మరియు పిడకలు'), 2, TRUE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Navadhanyam (9 sacred grains package)', 'te', 'నవధాన్యాలు'), 3, FALSE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Navagraha Vastrams (9 colored cloth pieces)', 'te', 'నవగ్రహ వస్త్రాలు (9 రంగులు)'), 4, FALSE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Dry coconut halves (Kobbari Chippalu)', 'te', 'హోమం ఎండు కొబ్బరి చిప్పలు'), 5, TRUE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'White sesame seeds (Nuvvulu)', 'te', 'తెల్ల నువ్వులు'), 6, TRUE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Wheat rava for Satyanarayana prasadam (if included)', 'te', 'గోధుమ రవ్వ (వ్రతం చేర్చుకున్నచో)'), 7, TRUE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Fresh betel leaves (Tamalapaakulu - 25 count)', 'te', 'తమలపాకులు (25)'), 8, FALSE),
        (v_version_id, 'katha_sankalpam_items', jsonb_build_object('en', 'Betel nuts (Vakkalu)', 'te', 'వక్కలు'), 9, FALSE);

        -- --------------------------------------------------------------------
        -- 1.3 FAQS
        -- --------------------------------------------------------------------
        DELETE FROM ps.vidhi_faq WHERE vidhi_version_id = v_version_id;

        INSERT INTO ps.vidhi_faq (vidhi_version_id, question, answer, sort_order)
        VALUES
        (
            v_version_id,
            jsonb_build_object(
                'en', 'Are Homam and Satyanarayana Vratam included in standard Gruhapravesam?',
                'te', 'సాధారణ గృహప్రవేశంలో హోమం మరియు సత్యనారాయణ వ్రతం ఉంటాయా?'
            ),
            jsonb_build_object(
                'en', 'Yes, Vastu Homam and Satyanarayana Vratam can be included based on your custom package and family tradition. You can confirm with your assigned Vedic Purohit prior to the date.',
                'te', 'అవును, మీ కుటుంబ సాంప్రదాయం మరియు ప్యాకేజీని బట్టి వాస్తు హోమం మరియు సత్యనారాయణ వ్రతాన్ని జరుపుకోవచ్చు. బుకింగ్ సమయంలో పురోహితునితో నిర్ధారించుకోవచ్చు.'
            ),
            1
        ),
        (
            v_version_id,
            jsonb_build_object(
                'en', 'What is the significance of the Milk Boiling ritual?',
                'te', 'గృహప్రవేశంలో పాలు పొంగించడం యొక్క ప్రాముఖ్యత ఏమిటి?'
            ),
            jsonb_build_object(
                'en', 'Boiling milk in a new vessel until it overflows symbolizes unbounded prosperity, health, and joy flowing through the new home.',
                'te', 'కొత్త పాత్రలో పాలు పొంగించడం వల్ల నూతన గృహంలో ఆనందం, సంపద, మరియు సమృద్ధి నిరంతరం వెల్లివిరుస్తాయని విశ్వాసం.'
            ),
            2
        ),
        (
            v_version_id,
            jsonb_build_object(
                'en', 'Who brings the Homam Kundam and Samidhalu?',
                'te', 'హోమ కుండం మరియు సమిధలు ఎవరు ఏర్పాటు చేస్తారు?'
            ),
            jsonb_build_object(
                'en', 'If you opt for Purohit Samagri package, our certified Purohit brings the portable Homa Kundam, pure Samidhalu, and Homam materials. You only need to arrange a safe, ventilated spot.',
                'te', 'పురోహిత్ సామాగ్రి కిట్ ఎంచుకుంటే, మా వేద పండితులే హోమ కుండం, సమిధలు తీసుకువస్తారు. మీరు సరైన స్థలాన్ని సిద్ధం చేస్తే సరిపోతుంది.'
            ),
            3
        ),
        (
            v_version_id,
            jsonb_build_object(
                'en', 'What should the family keep ready before the Purohit arrives?',
                'te', 'పురోహితులు రాకముందు కుటుంబసభ్యులు ఏమేమి సిద్ధం చేసుకోవాలి?'
            ),
            jsonb_build_object(
                'en', 'Please ensure the house and entrance are clean, rangoli drawn, fresh milk, stove ready for boiling, drinking water, and gotram/nakshatram details of family members ready for Sankalpam.',
                'te', 'ఇల్లు మరియు సింహద్వారం శుభ్రం చేసి, ముగ్గులు వేసి, పాలు కాచే స్టవ్, మంచినీరు మరియు సంకల్పం కోసం కుటుంబ సభ్యుల గోత్రనామాలు సిద్ధంగా ఉంచుకోవాలి.'
            ),
            4
        );

        -- Re-publish the version
        UPDATE ps.vidhi_version
        SET
            title = jsonb_build_object(
                'en', 'Gruhapravesam Vidhi · ' || v_vidhi_rec.sampradayam_name,
                'te', 'గృహప్రవేశ విధి · ' || v_vidhi_rec.sampradayam_name
            ),
            duration_minutes = 180,
            needs_homa_kundam = TRUE,
            status = 'published'::ps.vidhi_status
        WHERE id = v_version_id;

    END LOOP;

    RAISE NOTICE 'Gruhapravesam data successfully seeded across all 5 Sampradayam vidhis.';
END $$;

COMMIT;
